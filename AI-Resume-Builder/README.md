# ResumeAI - Premium AI-Powered Resume Builder

ResumeAI is a modern, full-stack web application designed to help job seekers create stunning, ATS-friendly resumes in minutes. Leveraging the power of Google Gemini AI, it offers intelligent content generation and real-time ATS compatibility scoring.

## Features

- **AI-Powered Generation**: Instantly create professional resume content from a job title and brief experience summary.
- **ATS Scoring Engine**: Get real-time feedback and a 0-100% compatibility score for your resume based on industry standards.
- **Premium Design System**: A state-of-the-art dark-mode interface with glassmorphism, animated backgrounds, and smooth transitions.
- **Powerful Manual Editor**: A comprehensive split-panel editor for full control over every resume section with live preview.
- **Template Gallery**: Choose from multiple pre-designed, professional layouts (Modern, Executive, Creative, Classic).
- **PDF Export**: Download high-quality, print-ready PDFs directly from your browser.
- **Secure Auth & Storage**: JWT-based authentication and persistent SQLite storage for all your resumes.

## Tech Stack

**Frontend:**

- Vite + React 19
- React Router 7
- Vanilla CSS (Glassmorphism Design System)
- `html2canvas` & `jsPDF` for PDF generation

**Backend:**

- Node.js & Express
- SQLite (via `better-sqlite3`)
- JSON Web Tokens (JWT) for Auth
- `bcryptjs` for security
- Google Gemini API integration

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository:**

   ```bash
   cd AI-Resume-Builder
   ```

2. **Setup the Backend:**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:

   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend:**

   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd client
   npm run dev
   ```
