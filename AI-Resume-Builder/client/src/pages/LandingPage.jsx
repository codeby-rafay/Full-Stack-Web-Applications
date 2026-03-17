import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import './LandingPage.css';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge badge-primary">✨ AI-Powered Resume Builder</span>
            </div>
            <h1 className="hero-title">
              Build Your Perfect<br />
              <span className="gradient-text">Resume in Minutes</span>
            </h1>
            <p className="hero-subtitle">
              Create stunning, professional resumes with our intelligent builder. 
              Choose from beautiful templates, or let AI craft your perfect resume automatically.
            </p>
            <div className="hero-actions">
              <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                Start Building Free →
              </Link>
              <Link to="/templates" className="btn btn-secondary btn-lg">
                View Templates
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Resumes Created</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Templates</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card glass-card">
              <div className="mock-resume">
                <div className="mock-header">
                  <div className="mock-avatar"></div>
                  <div className="mock-info">
                    <div className="mock-line mock-line-lg"></div>
                    <div className="mock-line mock-line-sm"></div>
                  </div>
                </div>
                <div className="mock-section">
                  <div className="mock-line mock-line-md"></div>
                  <div className="mock-line mock-line-full"></div>
                  <div className="mock-line mock-line-full"></div>
                  <div className="mock-line mock-line-lg"></div>
                </div>
                <div className="mock-section">
                  <div className="mock-line mock-line-md"></div>
                  <div className="mock-line mock-line-full"></div>
                  <div className="mock-line mock-line-full"></div>
                </div>
                <div className="mock-skills">
                  <div className="mock-skill"></div>
                  <div className="mock-skill"></div>
                  <div className="mock-skill"></div>
                  <div className="mock-skill"></div>
                </div>
              </div>
            </div>
            <div className="floating-badge floating-badge-1 glass-card">
              <span>🎨</span> Beautiful Design
            </div>
            <div className="floating-badge floating-badge-2 glass-card">
              <span>🤖</span> AI Powered
            </div>
            <div className="floating-badge floating-badge-3 glass-card">
              <span>📄</span> PDF Export
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Stand Out</span>
            </h2>
            <p className="section-subtitle">
              Powerful tools to create resumes that get you noticed by employers and pass ATS systems.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(108, 99, 255, 0.15)' }}>✍️</div>
              <h3>Manual Builder</h3>
              <p>Full control over every section. Drag and drop, edit freely, and customize to perfection.</p>
            </div>
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>🤖</div>
              <h3>AI Resume Writer</h3>
              <p>Enter your job title and experience — AI generates compelling, professional content instantly.</p>
            </div>
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(255, 107, 107, 0.15)' }}>🎨</div>
              <h3>Premium Templates</h3>
              <p>Choose from curated, ATS-friendly templates designed by professional graphic designers.</p>
            </div>
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(255, 165, 2, 0.15)' }}>📄</div>
              <h3>PDF Export</h3>
              <p>Download your polished resume as a high-quality PDF, ready to send to employers.</p>
            </div>
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(46, 213, 115, 0.15)' }}>💾</div>
              <h3>Cloud Storage</h3>
              <p>Access and edit your resumes from anywhere. All your data is saved securely in the cloud.</p>
            </div>
            <div className="feature-card glass-card glass-card-hover">
              <div className="feature-icon" style={{ background: 'rgba(139, 131, 255, 0.15)' }}>⚡</div>
              <h3>Real-time Preview</h3>
              <p>See changes instantly with our live preview. What you see is exactly what you get.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="section-subtitle">
              Three simple steps to create your professional resume
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Choose Your Path</h3>
              <p>Build manually with full control, or let our AI generate professional content for you.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">02</div>
              <h3>Pick a Template</h3>
              <p>Select from our collection of stunning, industry-specific resume templates.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">03</div>
              <h3>Download & Apply</h3>
              <p>Export your polished resume as PDF and start landing interviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-card glass-card">
            <h2>Ready to Build Your <span className="gradient-text">Dream Resume</span>?</h2>
            <p>Join thousands of professionals who have landed their dream jobs with ResumeAI.</p>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
              Get Started — It's Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="navbar-brand">
                <div className="logo-icon">✦</div>
                <span className="gradient-text">ResumeAI</span>
              </div>
              <p>Build professional resumes with the power of AI.</p>
            </div>
            <div className="footer-links">
              <Link to="/templates">Templates</Link>
              <Link to="/register">Get Started</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
