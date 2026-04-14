# AI-Resume-Builder - Premium AI-Powered Resume Builder

ResumeAI is a modern, full-stack web application designed to help job seekers create stunning, ATS-friendly resumes in minutes. Leveraging the power of Google Gemini AI, it offers intelligent content generation and real-time ATS compatibility scoring for professional growth.

---

## Features

- **AI-Powered Generation**: Instantly create professional resume content from a job title and brief experience summary using Google Gemini API.
- **ATS Scoring Engine**: Get real-time feedback and a 0-100% compatibility score for your resume based on industry standards and keywords.
- **Premium Design System**: A state-of-the-art dark-mode interface with glassmorphism effects, animated backgrounds, and smooth transitions.
- **Powerful Manual Editor**: A comprehensive split-panel editor for full control over every resume section with live preview.
- **Template Gallery**: Choose from multiple pre-designed, professional layouts (Modern, Executive, Creative, Classic).
- **PDF Export**: Download high-quality, print-ready PDFs directly from your browser.
- **Secure Auth & Storage**: JWT-based authentication and persistent SQLite storage for all your resumes.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

---

## Tech Stack

### **Frontend**

- **Vite** - Lightning-fast build tool and dev server
- **React 19** - Latest React library for UI components
- **React Router 7** - Client-side routing and navigation
- **Vanilla CSS** - Custom glassmorphism design system with animations
- **html2canvas & jsPDF** - PDF generation and export functionality

### **Backend**

- **Node.js & Express** - Server runtime and web framework
- **SQLite (better-sqlite3)** - Lightweight, file-based database
- **JSON Web Tokens (JWT)** - Stateless authentication
- **bcryptjs** - Password hashing and security
- **Google Gemini API** - AI-powered content generation
- **CORS & Middleware** - Cross-origin handling and request processing

---

## Project Structure

```
AI-Resume-Builder/
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.jsx     # Navigation component
│   │   │   ├── ResumePreview.jsx
│   │   │   └── ResumePreview.css
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIBuilder.jsx
│   │   │   ├── ResumeEditor.jsx
│   │   │   └── TemplateGallery.jsx
│   │   ├── assets/            # Images and static assets
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static public files
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tsconfig.json          # TypeScript config
│
├── server/                    # Backend Node.js Application
│   ├── routes/                # API route handlers
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── resumes.js         # Resume CRUD operations
│   │   ├── ai.js              # AI generation endpoints
│   │   └── templates.js       # Template endpoints
│   ├── middleware/            # Middleware functions
│   │   └── auth.js            # JWT verification middleware
│   ├── index.js               # Express server setup
│   ├── db.js                  # Database initialization
│   ├── seed.js                # Database seeding script
│   └── package.json           # Backend dependencies
│
└── README.md                  # Project documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Google Gemini API Key** (for AI features)
- **Git** (optional, for cloning)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd AI-Resume-Builder
```

#### 2. Setup Backend Server

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following environment variables:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_PATH=./resumes.db
NODE_ENV=development
```

**Getting API Keys:**

- [Google Gemini API Key](https://ai.google.dev/) - Free tier available
- JWT_SECRET - Generate a random string for security (e.g., `openssl rand -base64 32`)

#### 3. Setup Frontend Application

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (if needed):

```env
VITE_API_URL=http://localhost:5000
```

---

## Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**

```bash
cd server
npm run dev
```

Expected output:

```
Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server:**

```bash
cd client
npm run dev
```

Expected output:

```
Local: http://localhost:5173
```

Visit `http://localhost:5173` in your browser to access the application.

### Production Build

**Build Frontend:**

```bash
cd client
npm run build
```

**Start Production Server:**

```bash
cd server
npm start
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Create a new user account
- `POST /login` - User login and JWT token generation
- `POST /logout` - User logout

### Resume Routes (`/api/resumes`)

- `GET /` - Get all resumes for authenticated user
- `GET /:id` - Get a specific resume by ID
- `POST /` - Create a new resume
- `PUT /:id` - Update an existing resume
- `DELETE /:id` - Delete a resume

### AI Routes (`/api/ai`)

- `POST /generate` - Generate resume content using AI
- `POST /score-ats` - Get ATS compatibility score

### Template Routes (`/api/templates`)

- `GET /` - Get all available resume templates
- `GET /:id` - Get specific template details

---

## Available Scripts

### Client Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

### Server Scripts

```bash
npm run dev       # Start server with auto-reload (nodemon)
npm start         # Start production server
npm run seed      # Seed database with sample data
```

---

## Authentication Flow

1. User registers with email and password
2. Password is hashed using `bcryptjs`
3. On login, credentials are verified and JWT token is issued
4. Token is stored in browser (localStorage/sessionStorage)
5. Token is sent in Authorization header for protected routes
6. Server verifies token on each authenticated request

---

## Database Schema

### Users Table

```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- createdAt
- updatedAt
```

### Resumes Table

```sql
- id (PRIMARY KEY)
- userId (FOREIGN KEY -> Users)
- title
- content (JSON)
- template
- atsScore
- createdAt
- updatedAt
```

---

## Design System

The application uses a **Glassmorphism Design System** featuring:

- Dark mode with frosted glass effect backgrounds
- Smooth animations and transitions
- Responsive layout that works on all screen sizes
- Accessible color contrast and typography
- Intuitive UI/UX for resume building

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code follows project style guidelines
- All new features have appropriate documentation
- Tests are included for new functionality

---

## License

This project is open source and available for personal and educational use.

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### CORS Errors

Ensure backend is running on `http://localhost:5000` and frontend `.env` has correct `VITE_API_URL`

### Database Errors

Delete `resumes.db` in server folder and restart to reset database

### Gemini API Errors

Verify API key is correct and active in your Google account

---

## Future Enhancements

- [ ] Export as DOCX format
- [ ] Collaboration features
- [ ] Resume templates marketplace
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Cover letter builder
- [ ] LinkedIn integration

---

## Author

Rafay Ali

**Happy Coding!**
