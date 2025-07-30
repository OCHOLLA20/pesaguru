# 💰 PesaGuru – AI-Powered Financial Advisory Chatbot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://python.org)
[![React 18+](https://img.shields.io/badge/react-18+-blue.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://docker.com)
[![Swahili NLP](https://img.shields.io/badge/Swahili-NLP%20Support-orange.svg)](https://spacy.io)

**PesaGuru** is an intelligent, multilingual financial advisory chatbot specifically tailored for the Kenyan market. It provides personalized investment planning, loan comparison, market insights, budgeting assistance, and comprehensive financial education through natural conversation in both English and Swahili.

![PesaGuru Screenshot](./client/public/logo512.png)

> *Empowering financial decision-making with AI, local context, and clarity.* 🇰🇪

---

## 🚀 Key Features

### 🤖 **AI-Powered Conversational Interface**
- ✅ **Multilingual Chatbot** (English & Swahili with custom NLP pipeline)
- 🧠 **Advanced NER and Intent Classification** via trained spaCy models
- 💬 **Context-Aware Conversations** with chat history and user memory
- 🔄 **Real-time Response Optimization** based on user feedback

### 💰 **Comprehensive Financial Services**
- ✅ **Personalized Investment Recommendations** based on risk profiling
- 📊 **Loan Comparison and Affordability Assessment** across Kenyan banks
- 📈 **Portfolio Management** with real-time tracking and analytics
- 💡 **Financial Goal Setting and Tracking** with milestone monitoring
- 🎯 **Smart Budgeting Tools** with expense categorization
- 💳 **Savings Plan Optimization** with compound interest calculations

### 📊 **Market Intelligence & Analytics**
- 📈 **Real-time Market Trend Analysis** with sentiment scoring
- 💱 **Live Forex Exchange Rates** and currency conversion
- 📰 **Financial News Sentiment Analysis** with impact assessment
- 📉 **Macroeconomic Indicators Tracking** for informed decisions
- 🔍 **Anomaly Detection** in financial data patterns
- 📊 **Interactive Dashboards** with customizable charts and reports

### 🔐 **Security & User Management**
- 🛡️ **JWT Authentication** with role-based access control
- 🔒 **End-to-end Data Encryption** for sensitive information
- 👤 **Comprehensive User Profiles** with preference management
- 📱 **Multi-device Synchronization** across platforms
- 🔍 **Audit Logging** for all financial transactions and advice

---

## 🏗️ Project Architecture

```bash
PesaGuru/
│
├── 🎨 client/                           # React Frontend Application
│   ├── src/
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── charts/                  # Financial data visualizations
│   │   │   └── Chatbot/                 # Chat interface components
│   │   ├── pages/                       # Application pages & routes
│   │   ├── apiClient/                   # API integration layer
│   │   │   ├── auth.js                  # Authentication API calls
│   │   │   ├── chatbot.js               # Chatbot communication
│   │   │   ├── financial_goal.js        # Goal management API
│   │   │   ├── investment.js            # Investment services API
│   │   │   └── market.js                # Market data API
│   │   ├── context/                     # React Context providers
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── utils/                       # Frontend utilities
│   │   └── styles/                      # Global styles & themes
│   └── public/
│       ├── locales/                     # i18n language files
│       │   ├── en/                      # English translations
│       │   └── sw/                      # Swahili translations
│       └── images/                      # Static assets
│
├── 🖥️ server/                            # FastAPI Backend Application
│   ├── api/                             # API routes and endpoints
│   │   ├── auth/                        # Authentication endpoints
│   │   ├── chatbot/                     # Chatbot conversation API
│   │   ├── routes/                      # Business logic routes
│   │   ├── models/                      # Pydantic data models
│   │   └── schemas/                     # API request/response schemas
│   ├── ai/                              # AI/ML Services
│   │   ├── models/                      # Trained model files
│   │   ├── nlp/                         # NLP processing pipeline
│   │   ├── recommenders/                # Recommendation engines
│   │   └── swahili_support/             # Custom Swahili NLP
│   ├── services/                        # Business logic services
│   ├── utils/                           # Backend utilities
│   │   ├── security.py                  # Security & encryption
│   │   ├── validators.py                # Data validation
│   │   └── logger.py                    # Logging configuration
│   └── data/                            # Data storage
│       ├── knowledge_base/              # Financial knowledge base
│       └── profiles/                    # User profile data
│
├── 🗄️ database/                          # Database Management
│   ├── migrations/                      # Alembic migration files
│   │   ├── create_users_table.sql       # User management
│   │   ├── create_investments_table.sql # Investment tracking
│   │   ├── create_conversations_table.sql # Chat history
│   │   └── create_market_summary_table.sql # Market data
│   └── seeds/                           # Default data seeders
│       ├── kenya_investment_options.sql # Local investment products
│       ├── default_risk_profiles.sql    # Risk assessment profiles
│       └── default_exchange_rates.sql   # Currency exchange rates
│
├── 🤖 models/                            # Trained AI Models
│   └── ner_model/                       # Custom NER model for finance
│       ├──ℹ️ config.cfg                 # spaCy model configuration
│       ├── meta.json                    # Model metadata
│       └── [model_components]/          # NER, tokenizer, parser components
│
├── 📓 Notebooks/                         # Data Science & Analysis
│   ├── AI Model Development Notebooks/
│   │   ├── Intent_Classification_Model.ipynb
│   │   ├── Entity_Recognition_Model.ipynb
│   │   ├── Swahili_Language_Support.ipynb
│   │   └── Chatbot_Response_Optimization.ipynb
│   ├── Data Analysis Notebooks/
│   │   ├── Financial_Chatbot_Survey_Analysis.ipynb
│   │   ├── Market_Trend_Analysis.ipynb
│   │   ├── Sentiment_Analysis.ipynb
│   │   └── Macroeconomic_Indicators_Analysis.ipynb
│   ├── API Integration Notebooks/
│   │   ├── Forex_Exchange_Analysis.ipynb
│   │   └── News_API_Scraper.ipynb
│   └── Predictive Modeling Notebooks/
│       └── Anomaly_Detection_Financial_Data.ipynb
│
├── 🐳 docker/                            # Docker Configuration
│   ├── client.Dockerfile               # Frontend container
│   ├── server.Dockerfile               # Backend container
│   └── jupyter.Dockerfile              # Jupyter notebook container
│
├── ⚙️ nginx/                             # Load Balancer Configuration
│   └── conf.d/app.conf                 # Nginx routing rules
│
├── 🧪 Tests/                             # Comprehensive Test Suite
│   ├── test_api.py                     # API endpoint tests
│   ├── test_auth.py                    # Authentication tests
│   ├── test_nlp.py                     # NLP model tests
│   ├── test_recommenders.py            # Recommendation engine tests
│   └── test_integrations.py            # Third-party API tests
│
└── 📋 Configuration Files
    ├── docker-compose.dev.yml          # Development environment
    ├── docker-compose.prod.yml         # Production environment
    ├── requirements.txt                 # Python dependencies
    └── Masters_Dissertation_Presentation_.pptx
```

---

## 🛠️ Technology Stack

### 🔙 **Backend Technologies**
- **FastAPI** – High-performance Python web framework with automatic API documentation
- **SQLAlchemy + Alembic** – Robust ORM with database migration management
- **PostgreSQL** – Production-grade relational database
- **Redis** – Caching and session management
- **Celery** – Asynchronous task processing
- **Pydantic** – Data validation and serialization

### 🧠 **AI & Machine Learning**
- **spaCy** – Custom trained NLP models for financial entity recognition
- **Scikit-learn** – Intent classification and recommendation algorithms
- **NLTK & TextBlob** – Sentiment analysis and text processing
- **Custom Swahili NLP Pipeline** – Tokenizer, NER, POS tagging, lemmatization
- **TensorFlow/PyTorch** – Deep learning models for advanced predictions

### 🎨 **Frontend Technologies**
- **React.js 18+** – Modern component-based UI framework
- **Tailwind CSS** – Utility-first styling framework
- **i18next** – Comprehensive internationalization support
- **Chart.js/Recharts** – Interactive financial data visualizations
- **React Query** – Server state management and caching
- **React Hook Form** – Efficient form handling and validation

### 🔧 **DevOps & Infrastructure**
- **Docker & Docker Compose** – Containerized development and deployment
- **Nginx** – Reverse proxy and load balancing
- **GitHub Actions** – CI/CD pipeline automation
- **Jest & Pytest** – Comprehensive testing frameworks
- **ESLint & Prettier** – Code quality and formatting

---

## ⚡ Quick Start Guide

### ✅ **Prerequisites**
- **Docker** & **Docker Compose** (recommended)
- **Python 3.10+** with pip
- **Node.js 16+** with npm
- **PostgreSQL 13+** (if running locally)
- **Redis** (for caching)

### 🐳 **Docker Setup (Recommended)**

```bash
# 1. Clone the repository
git clone https://github.com/OCHOLLA20/pesaguru.git
cd pesaguru

# 2. Create environment configuration
cp .env.example .env
# Edit .env with your configuration

# 3. Start development environment
docker-compose -f docker-compose.dev.yml up --build

# 4. Start production environment
docker-compose -f docker-compose.prod.yml up --build
```

**Access Points:**
- 🌐 **Frontend**: http://localhost:3000
- 🔗 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 📓 **Jupyter Notebooks**: http://localhost:8888

### 🛠️ **Manual Development Setup**

**Backend Setup:**
```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Set up database
python run_sql_migrations.py

# Start development server
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup:**
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### 🗄️ **Database Setup**
```bash
# Run all migrations
python run_sql_migrations.py

# Seed default data
psql -d pesaguru_db -f database/seeds/default_risk_profiles.sql
psql -d pesaguru_db -f database/seeds/kenya_investment_options.sql
psql -d pesaguru_db -f database/seeds/default_exchange_rates.sql
```

---

## 🌍 **Multi-Language Support**

PesaGuru provides comprehensive language support:

| Language | Status | Features |
|----------|--------|----------|
| **English** | ✅ Complete | Full NLP pipeline, all features |
| **Swahili** | ✅ Complete | Custom tokenizer, NER, POS tagging, lemmatization |

**Language Features:**
- 🔤 **Custom Swahili Tokenizer** – Handles unique grammatical structures
- 🏷️ **Named Entity Recognition** – Identifies financial terms in both languages
- 💬 **Natural Conversation Flow** – Context-aware responses
- 📚 **Localized Financial Knowledge** – Kenya-specific terminology and concepts

---

## 🧠 **AI Capabilities & Example Queries**

### 💼 **Investment Planning**
```
English: "Compare high-yield investment options for KES 100,000"
Swahili: "Nisaidie kupanga uwekezaji wa KES 50,000 kwa hatari ya chini"
```

### 🏦 **Loan Advisory**
```
English: "Which bank offers the best mortgage rates for first-time buyers?"
Swahili: "Nataka mkopo wa nyumba, ni benki gani ina riba nafuu?"
```

### 💰 **Budgeting & Savings**
```
English: "Help me create a budget for KES 80,000 monthly salary"
Swahili: "Nisaidie kupanga bajeti ya mshahara wa KES 80,000 kila mwezi"
```

### 📈 **Market Analysis**
```
English: "What's the current trend for NSE technology stocks?"
Swahili: "Je, hali ya soko la hisa za teknolojia NSE ni vipi?"
```

---

## 🧪 **Testing**

### **Run Complete Test Suite**
```bash
# Backend tests
cd server
pytest Tests/ -v --cov=api --cov-report=html

# Frontend tests
cd client
npm test -- --coverage --watchAll=false

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### **Test Categories**
- ✅ **Unit Tests** – Individual component testing
- 🔗 **API Tests** – Endpoint functionality and validation
- 🤖 **NLP Tests** – Model accuracy and performance
- 🔐 **Security Tests** – Authentication and authorization
- 📊 **Integration Tests** – End-to-end workflows

---

## 📚 **API Documentation**

### **Interactive Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### **Key API Endpoints**

#### 🔐 **Authentication**
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/refresh     # Token refresh
DELETE /api/auth/logout    # User logout
```

#### 💬 **Chatbot Services**
```http
POST /api/chatbot/message  # Send message to chatbot
GET /api/chatbot/history   # Retrieve chat history
POST /api/chatbot/feedback # Submit response feedback
```

#### 💰 **Financial Services**
```http
GET /api/investments/recommendations    # Get personalized recommendations
POST /api/investments/portfolio        # Create/update portfolio
GET /api/loans/comparison             # Compare loan options
POST /api/goals/create               # Set financial goals
```

#### 📊 **Market Data**
```http
GET /api/market/summary       # Market overview
GET /api/market/news         # Financial news with sentiment
GET /api/market/forex        # Exchange rates
GET /api/market/trends       # Market trend analysis
```

---

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/pesaguru_db
REDIS_URL=redis://localhost:6379/0

# API Keys
NEWS_API_KEY=your_news_api_key
FOREX_API_KEY=your_forex_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional for enhanced NLP

# Security
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
ENCRYPTION_KEY=your_encryption_key

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8000/ws

# External Services
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Development
DEBUG=true
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 🚀 **Deployment**

### **Production Deployment**
```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d --build

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale server=3
```

### **Environment-Specific Configurations**
- **Development**: `docker-compose.dev.yml`
- **Staging**: `docker-compose.staging.yml`
- **Production**: `docker-compose.prod.yml`

### **Cloud Deployment Options**
- 🌩️ **AWS ECS/EKS** – Container orchestration
- 🔵 **Azure Container Instances** – Serverless containers
- ☁️ **Google Cloud Run** – Fully managed containerized apps
- 🌊 **DigitalOcean App Platform** – Simple PaaS deployment

---

## 🤝 **Contributing**

We welcome contributions from the community! Here's how you can help:

### **Getting Started**
1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. ✅ **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔀 **Open** a Pull Request

### **Development Guidelines**
- 📝 **Code Style**: Follow PEP 8 for Python, ESLint config for JavaScript
- 🧪 **Testing**: Write comprehensive tests for new features
- 📚 **Documentation**: Update README and API docs for changes
- 🔍 **Code Review**: All PRs require review before merging
- 📊 **Performance**: Ensure changes don't negatively impact performance

### **Areas for Contribution**
- 🌐 **Internationalization** – Add support for more languages
- 🤖 **AI Models** – Improve NLP accuracy and capabilities
- 📊 **Analytics** – Enhanced financial analysis features
- 🔒 **Security** – Security enhancements and audit
- 📱 **Mobile** – React Native mobile app development
- 🧪 **Testing** – Increase test coverage and add E2E tests

---

## 🔒 **Security**

PesaGuru implements industry-standard security practices:

- 🔐 **JWT Authentication** with secure token management
- 🛡️ **Data Encryption** for sensitive financial information
- 🔍 **Input Validation** and sanitization to prevent injections
- 🚫 **Rate Limiting** to prevent abuse and DDoS attacks
- 📝 **Audit Logging** for all financial operations
- 🔒 **HTTPS Enforcement** in production environments
- 🏠 **CORS Configuration** for secure cross-origin requests

---

## 📄 **License**

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 📞 **Support & Contact**

### **Project Information**
- 👨‍💻 **Developer**: [OCHOLLA20](https://github.com/OCHOLLA20)
- 📧 **Email**: ocholla.dev@gmail.com
- 🌐 **Project**: [PesaGuru on GitHub](https://github.com/OCHOLLA20/pesaguru)
- 📚 **Documentation**: Available in the `/docs` folder

### **Getting Help**
- 🐛 **Bug Reports**: Create an issue with the bug template
- 💡 **Feature Requests**: Open an issue with the feature template
- ❓ **Questions**: Start a discussion in GitHub Discussions
- 📧 **Direct Contact**: ocholla.dev@gmail.com

---

## 🙏 **Acknowledgments**

- 🎓 **Academic**: Built as part of a Masters dissertation project
- 🌍 **Community**: Thanks to the open-source community for amazing tools
- 🇰🇪 **Local Context**: Inspired by the Kenyan fintech ecosystem
- 🚀 **Innovation**: Pushing the boundaries of AI-powered financial services

---

## 📊 **Project Stats**

![GitHub stars](https://img.shields.io/github/stars/OCHOLLA20/pesaguru?style=social)
![GitHub forks](https://img.shields.io/github/forks/OCHOLLA20/pesaguru?style=social)
![GitHub issues](https://img.shields.io/github/issues/OCHOLLA20/pesaguru)
![GitHub pull requests](https://img.shields.io/github/issues-pr/OCHOLLA20/pesaguru)

---

> **PesaGuru** – *Transforming financial advisory through AI, empowering every Kenyan to make informed financial decisions.* 🚀💰🇰🇪
