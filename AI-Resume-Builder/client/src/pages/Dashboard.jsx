import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, ToastContext } from '../App';
import './Dashboard.css';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, API_URL } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setResumes(data);
    } catch (err) {
      addToast('Failed to load resumes', 'error');
    }
    setLoading(false);
  };

  const createResume = async () => {
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Untitled Resume',
          data: {
            personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', summary: '' },
            experience: [],
            education: [],
            skills: [],
            projects: []
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/editor/${data.id}`);
      }
    } catch (err) {
      addToast('Failed to create resume', 'error');
    }
  };

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
        addToast('Resume deleted', 'success');
      }
    } catch (err) {
      addToast('Failed to delete resume', 'error');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, <span className="gradient-text">{user?.name}</span></h1>
            <p className="dashboard-subtitle">Manage your resumes and create new ones</p>
          </div>
          <div className="dashboard-actions">
            <button onClick={createResume} className="btn btn-primary">
              ✨ Create Manually
            </button>
            <Link to="/ai-builder" className="btn btn-accent">
              🤖 Build with AI
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading-page">
            <div className="spinner"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">📝</div>
            <h2>No Resumes Yet</h2>
            <p>Create your first resume to get started. Choose between manual editing or our AI-powered builder.</p>
            <div className="empty-actions">
              <button onClick={createResume} className="btn btn-primary">
                ✍️ Create Manually
              </button>
              <Link to="/ai-builder" className="btn btn-accent">
                🤖 Build with AI
              </Link>
            </div>
          </div>
        ) : (
          <div className="resume-grid">
            {resumes.map(resume => {
              let resumeData = {};
              try { resumeData = JSON.parse(resume.data); } catch {}
              
              return (
                <div key={resume.id} className="resume-card glass-card glass-card-hover">
                  <div className="resume-card-header">
                    <div className="resume-card-info">
                      <h3>{resume.title}</h3>
                      <p>Last edited {new Date(resume.updated_at).toLocaleDateString()}</p>
                    </div>
                    {resume.ats_score > 0 && (
                      <div className={`ats-badge ${resume.ats_score > 80 ? 'good' : resume.ats_score > 50 ? 'avg' : 'poor'}`}>
                        ATS: {resume.ats_score}%
                      </div>
                    )}
                  </div>
                  <div className="resume-card-body">
                    {resumeData.personalInfo?.title && (
                      <p className="resume-card-role">{resumeData.personalInfo.title}</p>
                    )}
                  </div>
                  <div className="resume-card-actions">
                    <Link to={`/editor/${resume.id}`} className="btn btn-primary btn-sm">
                      Edit
                    </Link>
                    <button onClick={() => deleteResume(resume.id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
