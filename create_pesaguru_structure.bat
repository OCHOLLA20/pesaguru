@echo off
echo Creating PesaGuru project structure...

:: Create base project directories
mkdir pesaguru
cd pesaguru
mkdir backend frontend database docker nginx .github
mkdir .github\workflows

echo Creating backend structure...

:: Backend structure
cd backend
mkdir api ai integrations notebooks utils tests
mkdir api\routes api\models api\schemas api\services api\auth api\middleware
mkdir ai\nlp ai\recommenders ai\models ai\data
mkdir notebooks\ai_model_development notebooks\api_integration notebooks\data_analysis notebooks\deployment_testing notebooks\predictive_modeling notebooks\templates
mkdir notebooks\data_analysis\Financial_Data_Market_Analysis notebooks\data_analysis\Sentiment_Analysis notebooks\data_analysis\User_Behavior
mkdir utils\jupyter_helpers
mkdir database\migrations database\seeds
type nul > requirements.txt
type nul > .env.example
type nul > README.md

:: Backend core files
cd api
type nul > main.py
type nul > config.py
type nul > database.py

:: API routes
cd routes
type nul > auth.py
type nul > user.py
type nul > chatbot.py
type nul > investment.py
type nul > market_data.py
type nul > loan.py
type nul > financial_goal.py
type nul > education.py
cd ..

:: Models
cd models
type nul > base.py
type nul > user.py
type nul > conversation.py
type nul > message.py
type nul > portfolio.py
type nul > investment.py
type nul > financial_goal.py
type nul > risk_profile.py
type nul > loan.py
cd ..

:: Schemas
cd schemas
type nul > user.py
type nul > auth.py
type nul > token.py
type nul > chatbot.py
type nul > investment.py
type nul > financial_goal.py
type nul > portfolio.py
type nul > loan.py
type nul > market_data.py
cd ..

:: Services
cd services
type nul > auth_service.py
type nul > user_service.py
type nul > chatbot_service.py
type nul > investment_service.py
type nul > market_service.py
type nul > loan_service.py
type nul > notification_service.py
type nul > background_tasks.py
cd ..

:: Auth
cd auth
type nul > jwt.py
type nul > password.py
type nul > permissions.py
cd ..

:: Middleware
cd middleware
type nul > logging_middleware.py
type nul > rate_limiter.py
type nul > cache_middleware.py
cd ..\..

:: AI components
cd ai\nlp
type nul > text_preprocessor.py
type nul > intent_classifier.py
type nul > entity_extractor.py
type nul > swahili_processor.py
type nul > context_manager.py
cd ..\recommenders
type nul > investment_recommender.py
type nul > risk_analyzer.py
type nul > portfolio_optimizer.py
type nul > loan_recommender.py
cd ..\models
type nul > chatbot_model.pkl
type nul > sentiment_model.pkl
type nul > financial_bert.py
type nul > intent_model.pkl
type nul > entity_model.pkl
cd ..\data
type nul > financial_terms_dictionary.json
type nul > intent_training_data.csv
type nul > kenyan_financial_corpus.json
type nul > swahili_corpus.json
cd ..\..

:: Integrations
cd integrations
type nul > nse_api.py
type nul > cbk_api.py
type nul > mpesa_api.py
type nul > forex_api.py
type nul > news_api.py
cd ..

:: Utils
cd utils
type nul > logger.py
type nul > security.py
type nul > validators.py
type nul > formatters.py
cd ..

:: Notebooks
cd notebooks
type nul > README.md
type nul > schedule_config.json
cd templates
type nul > analysis_template.ipynb
type nul > model_development_template.ipynb
type nul > data_integration_template.ipynb
cd ..

:: Create sample notebook
cd ai_model_development
type nul > Intent_Classification_Model.ipynb
cd ..\data_analysis\Financial_Data_Market_Analysis
type nul > Market_Trend_Analysis.ipynb
cd ..\..\..

:: Tests
cd tests
type nul > test_api.py
type nul > test_auth.py
type nul > test_nlp.py
type nul > test_recommenders.py
type nul > test_integrations.py
cd ..\..

echo Creating frontend structure...

:: Frontend structure
cd ..\frontend
mkdir public src
mkdir public\locales public\locales\en public\locales\sw public\images
mkdir src\api src\components src\context src\hooks src\pages src\utils src\styles
mkdir src\components\layout src\components\common src\components\Chatbot src\components\Dashboard src\components\Investment src\components\forms src\components\charts
mkdir src\pages\Auth src\pages\Dashboard src\pages\Chatbot src\pages\Investment src\pages\Loan src\pages\Education src\pages\Profile
type nul > package.json
type nul > .env.development
type nul > .env.production
type nul > README.md
type nul > src\index.js
type nul > src\App.js
type nul > src\index.css
type nul > public\index.html
type nul > tailwind.config.js
type nul > src\i18n.js

:: Frontend API services
cd src\api
type nul > client.js
type nul > auth.js
type nul > user.js
type nul > chatbot.js
type nul > investment.js
type nul > market.js
type nul > loan.js
type nul > financial_goal.js
cd ..

:: Context
cd context
type nul > AuthContext.jsx
type nul > ChatbotContext.jsx
type nul > ThemeContext.jsx
type nul > LanguageContext.jsx
cd ..

:: Hooks
cd hooks
type nul > useAuth.js
type nul > useChatbot.js
type nul > useInvestments.js
type nul > useUserProfile.js
type nul > useMarketData.js
type nul > useNetworkStatus.js
type nul > useLocalStorage.js
cd ..

:: Utils
cd utils
type nul > validators.js
type nul > formatters.js
type nul > security.js
type nul > storage.js
cd ..

:: Components
cd components\layout
type nul > Layout.jsx
type nul > Navbar.jsx
type nul > Sidebar.jsx
type nul > Footer.jsx
type nul > MobileMenu.jsx
cd ..\common
type nul > Button.jsx
type nul > Card.jsx
type nul > LoadingSpinner.jsx
type nul > ErrorAlert.jsx
type nul > LanguageSelector.jsx
type nul > ProtectedRoute.jsx
cd ..\Chatbot
type nul > ChatbotInterface.jsx
type nul > ChatMessage.jsx
type nul > ChatInput.jsx
type nul > TypingIndicator.jsx
type nul > Suggestions.jsx
cd ..\Dashboard
type nul > FinancialSummary.jsx
type nul > GoalProgress.jsx
type nul > MarketOverview.jsx
type nul > RecentTransactions.jsx
cd ..\Investment
type nul > StockRecommendation.jsx
type nul > PortfolioAllocation.jsx
type nul > StockDetails.jsx
type nul > InvestmentForm.jsx
cd ..\forms
type nul > LoginForm.jsx
type nul > RegisterForm.jsx
type nul > ProfileForm.jsx
type nul > LoanCalculator.jsx
type nul > GoalForm.jsx
cd ..\charts
type nul > PortfolioAllocationChart.jsx
type nul > StockChart.jsx
type nul > PerformanceChart.jsx
type nul > RiskAssessmentChart.jsx
cd ..\..

:: Pages
cd pages\Auth
type nul > Login.jsx
type nul > Register.jsx
type nul > ForgotPassword.jsx
type nul > ResetPassword.jsx
cd ..\Dashboard
type nul > index.jsx
type nul > FinancialOverview.jsx
type nul > Goals.jsx
cd ..\Chatbot
type nul > index.jsx
type nul > ConversationHistory.jsx
cd ..\Investment
type nul > index.jsx
type nul > Recommendations.jsx
type nul > StockDetails.jsx
type nul > Portfolio.jsx
cd ..\Loan
type nul > index.jsx
type nul > Calculator.jsx
type nul > Comparison.jsx
cd ..\Education
type nul > index.jsx
type nul > Articles.jsx
type nul > Glossary.jsx
cd ..\Profile
type nul > index.jsx
type nul > Settings.jsx
type nul > Preferences.jsx
cd ..\..\..\..

echo Creating database structure...

:: Database structure
cd ..\database
mkdir migrations seeds
type nul > migrations\create_users_table.sql
type nul > migrations\create_portfolios_table.sql
type nul > migrations\create_conversations_table.sql
type nul > migrations\create_messages_table.sql
type nul > migrations\create_investments_table.sql
type nul > migrations\create_financial_goals_table.sql
type nul > migrations\create_risk_profiles_table.sql
type nul > seeds\default_risk_profiles.sql
type nul > seeds\kenya_investment_options.sql
cd ..

echo Creating Docker and configuration files...

:: Docker and configuration files
type nul > docker-compose.yml
type nul > docker-compose.dev.yml
type nul > docker-compose.prod.yml
cd docker
type nul > backend.Dockerfile
type nul > frontend.Dockerfile
type nul > jupyter.Dockerfile
cd ..
mkdir nginx\conf.d
type nul > nginx\conf.d\app.conf
type nul > .env.example
type nul > README.md

:: GitHub Actions workflow
cd .github\workflows
type nul > deploy.yml
cd ..\..

:: Translation files
cd frontend\public\locales\en
type nul > common.json
cd ..\sw
type nul > common.json
cd ..\..\..\..

echo PesaGuru project structure created successfully!
cd ..
