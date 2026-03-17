import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, ToastContext } from '../App';
import ResumePreview from '../components/ResumePreview';
import './AIBuilder.css';

const steps = [
  { key: 'info', title: 'Your Profile', subtitle: 'Tell us about yourself' },
  { key: 'review', title: 'Review & Edit', subtitle: 'AI-generated resume ready to customize' },
];

export default function AIBuilder() {
  const { token, API_URL } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const [form, setForm] = useState({
    jobTitle: '',
    experience: '',
    skills: '',
    education: '',
    description: ''
  });

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!form.jobTitle.trim()) {
      addToast('Please enter a job title', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const result = await res.json();

      if (res.ok && result.data) {
        setGeneratedData(result.data);
        setCurrentStep(1);
        addToast(result.fallback 
          ? 'Resume Generated' 
          : 'Resume generated with AI!', 'success');
      } else {
        addToast('Failed to generate resume', 'error');
      }
    } catch (err) {
      addToast('Network error. Please try again.', 'error');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!generatedData) return;

    try {
      const res = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `${form.jobTitle} Resume`,
          template_id: 1,
          data: generatedData
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast('Resume saved! Opening editor...', 'success');
        navigate(`/editor/${data.id}`);
      }
    } catch (err) {
      addToast('Failed to save resume', 'error');
    }
  };

  return (
    <div className="ai-page">
      <div className="container">
        <div className="ai-header">
          <span className="badge badge-accent">🤖 AI-Powered</span>
          <h1>AI Resume <span className="gradient-text">Builder</span></h1>
          <p>Tell us about your background and our AI will create a professional resume for you</p>
        </div>

        {/* Progress Steps */}
        <div className="ai-steps">
          {steps.map((s, i) => (
            <div key={s.key} className={`ai-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
              <div className="ai-step-circle">{i < currentStep ? '✓' : i + 1}</div>
              <div>
                <div className="ai-step-title">{s.title}</div>
                <div className="ai-step-sub">{s.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {currentStep === 0 && (
          <div className="ai-form-card glass-card">
            <div className="ai-form">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Senior Software Engineer"
                  value={form.jobTitle}
                  onChange={(e) => updateForm('jobTitle', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 5"
                    value={form.experience}
                    onChange={(e) => updateForm('experience', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <input
                    className="input-field"
                    placeholder="e.g. MIT, BS Computer Science"
                    value={form.education}
                    onChange={(e) => updateForm('education', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Key Skills</label>
                <input
                  className="input-field"
                  placeholder="e.g. React, Node.js, Python, AWS, SQL"
                  value={form.skills}
                  onChange={(e) => updateForm('skills', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  className="input-field textarea"
                  rows="3"
                  placeholder="Any specific achievements, certifications, or details you'd like included..."
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
              </div>
              <button onClick={handleGenerate} className="btn btn-accent btn-lg btn-block" disabled={loading}>
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner-small"></span> Generating with AI...
                  </span>
                ) : (
                  '🤖 Generate My Resume →'
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && generatedData && (
          <div className="ai-review">
            <div className="ai-review-preview">
              <ResumePreview data={generatedData} layoutConfig={{ primaryColor: '#6C63FF', layout: 'single-column', id: 'modern-minimal' }} />
            </div>
            <div className="ai-review-actions">
              <button onClick={handleSave} className="btn btn-primary btn-lg">
                💾 Save & Open Editor
              </button>
              <button onClick={() => setCurrentStep(0)} className="btn btn-secondary btn-lg">
                ← Generate Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
