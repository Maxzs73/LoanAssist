# LoanAssist
# 💰 LoanAssist — AI-Powered Loan & Credit Card Recommendation Platform

LoanAssist is a full-stack financial assistance platform that combines **Machine Learning, React, Django REST Framework, and PostgreSQL** to help users evaluate loan eligibility, check credit card eligibility, calculate financial metrics, and receive personalized financial recommendations.

The platform is designed to simulate a simplified digital banking/financial-assistance system where Machine Learning is used for eligibility prediction while rule-based financial engines handle calculations and recommendations.

---

## 🚀 Key Features

### 🏦 Loan Eligibility Prediction
- Predicts home loan eligibility using a trained Random Forest classification model.
- Uses financial and applicant information such as:
  - Applicant income
  - Co-applicant income
  - Loan amount
  - Loan term
  - Credit history
  - Savings
  - Debt ratio
  - Existing loans
  - Applicant demographic information

### 💳 Credit Card Eligibility Prediction
- Predicts credit card eligibility using a Random Forest classification model.
- Considers factors such as:
  - Age
  - Annual income
  - Credit score
  - Existing credit cards
  - Total debt
  - Monthly housing payment
  - Bank balance
  - Employment status
  - Selected credit card

### 📊 Financial Tools
- EMI Calculator
- Financial health analysis
- Debt ratio analysis
- Affordability checks

### 🏦 Bank & Product Recommendations
- Provides bank and financial product recommendations.
- Uses rule-based recommendation logic rather than relying entirely on ML.

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- User profile management
- Protected API endpoints

### 📜 Application History
- Stores previous loan and credit card applications.
- Allows authenticated users to view their application history.

---

## 🧠 Machine Learning

LoanAssist currently uses **Random Forest Classifier** models for both eligibility prediction systems.

### Home Loan Model

| Property | Details |
|---|---|
| Model | Random Forest Classifier |
| Dataset | Home Loan Dataset |
| Records | 8,000 |
| Features | 14 |
| Train/Test Split | 80/20 |
| Random State | 42 |
| Accuracy | 95.13% |
| Precision | 80.11% |
| Recall | 97.97% |
| F1 Score | 88.15% |

The most influential features include:

1. Credit History
2. Debt Ratio
3. Loan Amount
4. Applicant Income
5. Existing Loans
6. Savings

### Credit Card Model

| Property | Details |
|---|---|
| Model | Random Forest Classifier |
| Dataset | Credit Card Dataset |
| Records | 8,000 |
| Features | 9 |
| Train/Test Split | 80/20 |
| Random State | 42 |
| Accuracy | 97.44% |
| Precision | 92.13% |
| Recall | 99.79% |
| F1 Score | 95.80% |

---

## ⚙️ Machine Learning Pipeline

The ML pipeline follows these major steps:

```text
Raw Dataset
     ↓
Data Cleaning
     ↓
Missing Value Handling
     ↓
Numerical / Categorical Feature Separation
     ↓
Numerical Imputation + Scaling
     ↓
Categorical Imputation + One-Hot Encoding
     ↓
Train/Test Split
     ↓
Random Forest Training
     ↓
Model Evaluation
     ↓
Model Serialization using Joblib
     ↓
Saved Model + Preprocessor
     ↓
Django Prediction API

The trained models and preprocessing objects are saved using Joblib, allowing the backend to load the models and make predictions without retraining them every time the application starts.

🏗️ System Architecture
                 ┌─────────────────────┐
                 │     React Frontend  │
                 │  UI + User Actions  │
                 └──────────┬──────────┘
                            │
                         Axios
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Django REST API  │
                 │ Authentication/API  │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
       ML Prediction   Financial Engine  Recommendation
          Engine          Engine            Engine
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                   ┌─────────────────┐
                   │   PostgreSQL    │
                   │    Database     │
                   └─────────────────┘
🛠️ Technology Stack
Frontend
React.js
Vite
Tailwind CSS
JavaScript
Axios
React Router
State management
Backend
Python
Django
Django REST Framework
Simple JWT
Gunicorn
Database
PostgreSQL
Machine Learning
Python
Pandas
NumPy
Scikit-learn
Joblib
Development Tools
VS Code
Git
GitHub
PostgreSQL / pgAdmin
📁 Project Structure
LoanAssist/
│
├── backend/
│   ├── cards/
│   ├── core/
│   ├── financial_engine/
│   ├── loans/
│   ├── ml_models/
│   ├── recommendation_engine/
│   ├── users/
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
🔄 How the Application Works
1. User Authentication

The user registers or logs in through the React frontend.

React
 ↓
Axios Request
 ↓
Django REST API
 ↓
JWT Authentication
 ↓
PostgreSQL
2. Loan Prediction

The user enters financial and personal information.

User Input
   ↓
React Form
   ↓
Axios
   ↓
Django REST API
   ↓
Data Preprocessing
   ↓
Saved Random Forest Model
   ↓
Eligibility Prediction
   ↓
Prediction Response
   ↓
React Dashboard
3. Financial Analysis

Financial calculations such as EMI, affordability and debt ratio are handled through backend financial logic.

4. Recommendations

The recommendation engine uses predefined financial rules and available bank/product information to generate suitable recommendations.

🔐 Security

Sensitive configuration values are stored using environment variables.

Examples include:

SECRET_KEY
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT

Environment files such as .env are excluded from Git using .gitignore.

The application uses JWT authentication for protected API endpoints.

💾 Database

LoanAssist uses PostgreSQL for persistent data storage.

Major entities include:

Users
User Profiles
Loan Applications
Credit Card Applications
Banks
Credit Cards
Application History

Django migrations are used to create and maintain the database schema.

🧪 Testing

The backend contains test scripts covering important functionality such as:

Authentication endpoints
Prediction endpoints
User profiles
Recommendation engine
Card services
Financial affordability checks
🖥️ Local Setup
Prerequisites

Make sure the following are installed:

Python 3.x
Node.js
npm
PostgreSQL
Git
Backend Setup

Navigate to the backend directory:

cd backend

Create and activate a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Configure your environment variables in:

backend/.env

Run migrations:

python manage.py migrate

Start the Django server:

python manage.py runserver
Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will then be available through the Vite development server.

☁️ Deployment

The project can be deployed using separate services for frontend and backend.

Frontend

The React/Vite frontend can be deployed using platforms such as:

Netlify
Vercel
Backend

The Django backend can be deployed using platforms such as:

Render
Database

PostgreSQL can be hosted using:

Render PostgreSQL
Other managed PostgreSQL providers

The frontend communicates with the deployed Django REST API through Axios.

🎯 Project Objective

The main objective of LoanAssist is to demonstrate how Machine Learning and full-stack web development can be combined to build a practical financial assistance platform.

Instead of using Machine Learning for every feature, the system separates responsibilities:

Machine Learning → Eligibility prediction
Financial Engine → Financial calculations
Recommendation Engine → Financial/product recommendations
Django REST API → Backend communication
React → User interface
PostgreSQL → Persistent data storage

This separation makes the application easier to maintain, test and extend.

🔮 Future Improvements

Possible future improvements include:

Additional ML models for comparison
Explainable AI for prediction decisions
More financial products and banks
Advanced credit-risk analysis
Personalized financial planning
Improved fraud detection
Cloud-based ML model management
Mobile application
Real-time financial data integration
👨‍💻 Author

Nayan Bhatu

B.Tech Computer Engineering

⭐ Project Highlights
Full-stack React + Django application
Machine Learning based eligibility prediction
Random Forest classification
PostgreSQL database
JWT authentication
REST API architecture
Financial calculation engine
Recommendation engine
Production-oriented project structure
