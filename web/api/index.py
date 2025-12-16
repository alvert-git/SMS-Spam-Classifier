import pickle
import string
import json
import os
import ssl # Needed for NLTK download on some systems

from flask import Flask, request, jsonify
from nltk.corpus import stopwords
import nltk
from nltk.stem.porter import PorterStemmer



# --- 2. Preprocessing Functions (from your original script) ---
ps = PorterStemmer()

def transform_text(text):
    """Performs the same text preprocessing as your Streamlit app."""
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
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
    """
    API Endpoint for spam classification.
    Now includes probability scores.
    """
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
        
        # 3. Predict & Get Probabilities (The Change)
        # Get the full probability array (e.g., [[0.05, 0.95]])
        probabilities = model.predict_proba(vector_input)[0] 
        
        # The prediction is still the class with the highest probability
        prediction = probabilities.argmax() 
        
        # Extract individual probabilities and convert to percentage
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
        return jsonify({
            'error': 'An internal error occurred',
            'details': str(e)
        }), 500

# Optional: A simple root route for testing if the server is running
@app.route('/')
def home():
    return "SMS Spam Classifier API is running. Use the /predict endpoint with a POST request."

if __name__ == '__main__':
    # Run the application
    app.run(debug=True)
