# 📱 SMS Spam Classifier

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-PERN%20%2B%20Python%2FFlask-darkgreen)](https://en.wikipedia.org/wiki/PERN_stack)

A full-stack web application designed to accurately predict whether a given text message is **"Spam"** or **"Ham" (Not Spam)** using a trained Machine Learning model. The application features a modern, responsive interface and a robust, scalable backend architecture.

## 🚀 Live Demo

Experience the classifier in action!

[sms-spam-classifier-lyart.vercel.app/]

## ✨ Features

*   **Real-time Classification:** Instantly classify SMS messages via the web interface.
*   **High Accuracy ML Model:** Utilizes a robust classification algorithm (e.g., Naive Bayes, SVM, or LSTM) trained on a large corpus of SMS data.
*   **Modern UI:** Built with React and features a clean, intuitive design.
*   **Theme Toggle:** Supports both **Dark and Light Modes** for personalized viewing.
*   **Global State Management:** Seamless application state handling using **React Context API**.
*   **Scalable Architecture:** Separate services for the web API (Node/Express) and the ML model (Python/Flask).

## 📸 Screenshots

| Light Mode | Dark Mode |
| :---: | :---: |
| <img width="1537" height="879" alt="image" src="https://github.com/user-attachments/assets/8c477280-30c3-4876-b5f2-52a300bf4757" />| <img width="1629" height="874" alt="image" src="https://github.com/user-attachments/assets/497253f8-9f02-4824-83e4-6175b011e5b7" />|
|<img width="1892" height="874" alt="image" src="https://github.com/user-attachments/assets/b03f8a23-2c0d-4267-97f0-00f62a44d088" />|<img width="1899" height="878" alt="image" src="https://github.com/user-attachments/assets/74c23061-0632-4700-b68c-3d9b0c604bab" />|

## 🛠️ Tech Stack

This project uses a microservices-inspired architecture, combining the PERN stack for the web application and a dedicated Python service for the machine learning model.

### Frontend
*   **React:** Frontend library for building the user interface.
*   **Context API:** For global state management (e.g., theme, classification results).
*   **[Your CSS Framework, e.g., Tailwind CSS, Styled Components, Bootstrap]**

### Backend (Web API)
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web application framework for handling API routes and serving the frontend.
*   **PostgreSQL:** Robust relational database for storing application data (e.g., user history, settings).

### Machine Learning Service
*   **Python:** Programming language for model development.
*   **Flask:** Lightweight web server to expose the ML model as a REST API endpoint.
*   **[ML Library, e.g., Scikit-learn, TensorFlow, PyTorch]**
*   **[Model Used, e.g., Naive Bayes, Logistic Regression, LSTM]**

## ⚙️ Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

*   Node.js (v16+)
*   Python (v3.8+)
*   PostgreSQL
*   Git

### 1. Clone the Repository

```bash
git clone [Your Repository URL]
cd sms-spam-classifier
```

### 2. Database Setup (PostgreSQL)

1.  Create a new PostgreSQL database:
    ```sql
    CREATE DATABASE sms_classifier_db;
    ```
2.  Configure your database connection string in the backend's `.env` file.
3.  Run migrations/schema setup using your preferred tool (e.g., Sequelize, Knex, raw SQL).

### 3. Machine Learning Service (Python/Flask)

Navigate to the Flask directory (`/ml-service` or similar).

```bash
# Navigate to ML service directory
cd ml-service 

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run the Flask API
python app.py
# The ML API should now be running on http://127.0.0.1:5000 (or specified port)
```

### 4. Backend Web API (Node/Express)

Navigate to the Node/Express directory (`/server` or similar).

```bash
# Navigate to server directory
cd ../server

# Install dependencies
npm install

# Configure environment variables (DB credentials, Flask API URL) in a .env file.

# Start the Express server
npm start
# The Express API should now be running on http://localhost:5001 (or specified port)
```

### 5. Frontend (React)

Navigate to the React directory (`/client` or similar).

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start the React development server
npm start
# The application should open in your browser at http://localhost:3000
```


