import pickle
import string
import json
import os
import ssl # For NLTK download fix

from flask import Flask, request, jsonify
from nltk.corpus import stopwords
import nltk
from nltk.stem.porter import PorterStemmer

# --- CRITICAL NLTK FIX FOR VERCEl/SERVERLESS ENVIRONMENTS ---
# 1. Define a writable directory for NLTK data
nltk_data_dir = "/tmp/nltk_data"
os.makedirs(nltk_data_dir, exist_ok=True)
nltk.data.path.append(nltk_data_dir)

# Fix for NLTK resource downloading issues (SSL issue on some environments)
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# 2. Download required resources (stopwords and punkt for tokenization)
try:
    nltk.download("punkt", download_dir=nltk_data_dir)
    nltk.download("stopwords", download_dir=nltk_data_dir)
    print("NLTK resources downloaded successfully.")
except Exception as e:
    print(f"NLTK Download Error: {e}")
# --- END CRITICAL FIX ---


# --- 1. Model and Transformer Loading ---
# Determine the current directory to safely load files (web/api/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, 'vectorizer.pkl')

tfidf = None
model = None

try:
    with open(VECTORIZER_PATH, 'rb') as vf:
        tfidf = pickle.load(vf)
    with open(MODEL_PATH, 'rb') as mf:
        model = pickle.load(mf)
    print("Model and Vectorizer loaded successfully!")
    
except FileNotFoundError:
    # This will be printed to Vercel logs if the file is missing from the bundle
    print(f"FATAL ERROR: 'vectorizer.pkl' or 'model.pkl' not found at {BASE_DIR}. Check file paths/inclusion.")
    
except Exception as e:
    print(f"FATAL ERROR loading models: {e}")

# --- 2. Preprocessing Functions ---
ps = PorterStemmer()

def transform_text(text):
    """Performs the same text preprocessing as your original script."""
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        # Note: stopwords is only available because we downloaded it above
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)

# --- 3. Flask Application Setup ---
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_spam():
    """API Endpoint for spam classification."""
    
    # 0. Check if models are loaded (Handles the 500 Error if models failed to load at startup)
    if tfidf is None or model is None:
        return jsonify({
            'error': 'Internal Server Error: ML Models failed to load at startup.'
        }), 500
    
    try:
        data = request.get_json(force=True)
        
        if 'message' not in data:
            return jsonify({
                'error': 'Missing "message" key in JSON payload'
            }), 400

        input_sms = data['message']

        # 1. Preprocess
        transformed_sms = transform_text(input_sms)
        
        # 2. Vectorize
        vector_input = tfidf.transform([transformed_sms])
        
        # 3. Predict & Get Probabilities
        probabilities = model.predict_proba(vector_input)[0] 
        prediction = probabilities.argmax() 
        
        prob_ham = float(probabilities[0] * 100)
        prob_spam = float(probabilities[1] * 100)
        
        # 4. Format Result
        result_label = "Spam" if prediction == 1 else "Not Spam"
        
        return jsonify({
            'message': input_sms,
            'transformed': transformed_sms,
            'prediction': int(prediction), 
            'result': result_label,
            'probabilities': {
                'Ham': f"{prob_ham:.2f}%",
                'Spam': f"{prob_spam:.2f}%"
            }
        })

    except Exception as e:
        # Catches errors during request processing (e.g., failed JSON parse)
        return jsonify({
            'error': 'An internal error occurred during prediction.',
            'details': str(e)
        }), 500

# Optional: A simple root route for testing if the server is running
@app.route('/')
def home():
    if tfidf and model:
        status = "Models Loaded: OK"
    else:
        status = "Models Loaded: FAILED (Check Vercel Logs)"

    return f"SMS Spam Classifier API is running. Status: {status}. Use the /api/predict endpoint with a POST request."

if __name__ == '__main__':
    # Only runs when testing locally, Vercel ignores this block
    app.run(debug=True)