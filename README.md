# AI Ingredient Analyzer

A full-stack Web App that uses AI to analyze ingredient lists from product images, detect harmful substances, and provide safety recommendations.

## Features

### Core Functionality
- **Image Upload & OCR**: Upload or capture photos of ingredient lists with advanced text extraction
- **Multi-language Support**: Automatic language detection and translation to English
- **AI-Powered Analysis**: Google AI analyzes ingredients for harmful substances including:
  - Carcinogens
  - Neurotoxins
  - Hormone disruptors
  - Allergens
  - Overuse concerns
- **Risk Assessment**: Categorizes products as Low, Medium, or High risk
- **Detailed Recommendations**: Personalized usage guidelines and safety warnings
- **Analysis History**: Track and review all previous analyses

### Technical Features
- **Responsive Design**: Mobile-first glassmorphism UI
- **Authentication**: Secure JWT-based user accounts
- **Real-time Analysis**: Live progress updates during processing
- **Optimized Performance**: React memoization and lazy loading

## 🌟 Future Features
- **Image storage** - store ingredient image with the analysis
- **Edit analysis** - edit and update the analysis name with product name
- **Mobile apk** - mobile apk for the frontend

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Markdown** for formatted AI responses
- **Workbox** for PWA capabilities

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Tesseract.js** for OCR
- **Google AI (Gemini)** for ingredient analysis
- **JWT** authentication
- **Sharp** for image processing

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v12 or higher)
3. **Google AI API Key** - Get one at [Google AI Studio](https://ai.google.dev/)

## Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Al-Amin-Khan-Shakil/tox-scan-ai.git
   cd tox-scan-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE ingredient_analyzer;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE ingredient_analyzer TO your_user;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your settings:
   ```env
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432

   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the application**
   ```bash
   # Development mode (starts both frontend and backend)
   npm run dev

   # Or run separately:
   npm run dev:client  # Frontend only
   npm run dev:server  # Backend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/api/health


## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Analysis
- `POST /api/analysis/upload` - Upload and analyze image (protected)
- `GET /api/analysis/history` - Get analysis history (protected)
- `GET /api/analysis/:id` - Get specific analysis (protected)

## Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Image**: Take a photo or upload an image of ingredient lists
3. **Get Analysis**: AI processes the image and provides safety analysis
4. **Review Results**: View risk level, detailed analysis, and recommendations
5. **Track History**: Access all previous analyses in your dashboard

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Set production environment variables:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DB_HOST=your-production-db-host
# ... other production settings
```

### Database Migration
The application automatically creates tables on startup. For production, consider running migrations separately.

## Security Features

- **Helmet.js** for security headers
- **CORS** protection
- **Input validation** and sanitization
- **JWT** token authentication
- **Password hashing** with bcrypt
- **File upload** restrictions
- **Rate limiting** ready (can be added)

## Performance Optimizations

- **Image compression** with Sharp
- **Lazy loading** of components
- **React memoization** to prevent unnecessary renders
- **Database indexing** for fast queries
- **Compression** middleware for responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## ✍️ Authers
👤 **Al Amin Khan Shakil**

- GitHub: [Al Amin Khan Shakil](https://github.com/Al-Amin-Khan-Shakil)
- Twitter: [Al Amin Khan Shakil](https://twitter.com/AlAminKhan85004)
- LinkedIn: [Al Amin Khan Shakil](https://www.linkedin.com/in/al-amin-khan-shakil/)

## 🙏 Acknowledgments

- **Google AI** for providing the Gemini API
- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the utility-first styling approach

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
1. Check the GitHub Issues page
2. Review the troubleshooting section below
3. Create a new issue with detailed information

## Troubleshooting

### Common Issues

**OCR not working**: Ensure images are clear and well-lit
**Database connection**: Verify PostgreSQL is running and credentials are correct
**Google AI errors**: Check API key and ensure billing is enabled
**File upload issues**: Check file size limits and supported formats

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.