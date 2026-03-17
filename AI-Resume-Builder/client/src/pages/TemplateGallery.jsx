import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, ToastContext } from '../App';
import './TemplateGallery.css';

export default function TemplateGallery() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, API_URL } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/templates`);
      const data = await res.json();
      if (res.ok) setTemplates(data);
    } catch {
      addToast('Failed to load templates', 'error');
    }
    setLoading(false);
  };

  const useTemplate = async (templateId) => {
    if (!user) {
      navigate('/register');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'New Resume',
          template_id: templateId,
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
    } catch {
      addToast('Failed to create resume', 'error');
    }
  };

  const getTemplatePreview = (config) => {
    const layout = config.layout || 'single-column';
    const primary = config.primaryColor || '#6C63FF';
    const accent = config.accentColor || '#2D2B55';

    if (layout === 'sidebar') {
      return (
        <div className="tpl-preview-content" style={{ display: 'grid', gridTemplateColumns: '35% 1fr' }}>
          <div style={{ background: primary, padding: '12px 8px', borderRadius: '4px 0 0 4px' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', margin: '0 auto 8px' }}></div>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.4)', width: '80%', margin: '0 auto 4px' }}></div>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.2)', width: '60%', margin: '0 auto 8px' }}></div>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.15)', width: '90%', margin: '0 auto 3px' }}></div>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.15)', width: '70%', margin: '0 auto 3px' }}></div>
          </div>
          <div style={{ padding: '12px 10px' }}>
            <div className="tpl-line" style={{ background: primary, opacity: 0.4, width: '50%', height: 6, marginBottom: 6 }}></div>
            <div className="tpl-line"></div>
            <div className="tpl-line" style={{ width: '90%' }}></div>
            <div className="tpl-line" style={{ width: '70%', marginBottom: 8 }}></div>
            <div className="tpl-line" style={{ background: primary, opacity: 0.4, width: '50%', height: 6, marginBottom: 6 }}></div>
            <div className="tpl-line"></div>
            <div className="tpl-line" style={{ width: '80%' }}></div>
          </div>
        </div>
      );
    }

    if (layout === 'two-column') {
      return (
        <div className="tpl-preview-content">
          <div style={{ background: primary, padding: '10px', borderRadius: '4px 4px 0 0', textAlign: 'center' }}>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.8)', width: '50%', height: 7, margin: '0 auto 4px' }}></div>
            <div className="tpl-line" style={{ background: 'rgba(255,255,255,0.4)', width: '30%', margin: '0 auto' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10, padding: '10px' }}>
            <div>
              <div className="tpl-line" style={{ background: accent, opacity: 0.5, width: '45%', height: 6, marginBottom: 6 }}></div>
              <div className="tpl-line"></div>
              <div className="tpl-line" style={{ width: '85%' }}></div>
              <div className="tpl-line" style={{ width: '70%' }}></div>
            </div>
            <div>
              <div className="tpl-line" style={{ background: accent, opacity: 0.5, width: '60%', height: 6, marginBottom: 6 }}></div>
              <div className="tpl-line"></div>
              <div className="tpl-line" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      );
    }

    // Default single-column
    return (
      <div className="tpl-preview-content" style={{ padding: '12px' }}>
        <div style={{ borderBottom: `2px solid ${primary}`, paddingBottom: 8, marginBottom: 8 }}>
          <div className="tpl-line" style={{ background: primary, opacity: 0.6, width: '55%', height: 8, marginBottom: 4 }}></div>
          <div className="tpl-line" style={{ width: '35%' }}></div>
        </div>
        <div className="tpl-line" style={{ background: primary, opacity: 0.3, width: '40%', height: 6, marginBottom: 6 }}></div>
        <div className="tpl-line"></div>
        <div className="tpl-line" style={{ width: '90%' }}></div>
        <div className="tpl-line" style={{ width: '75%', marginBottom: 8 }}></div>
        <div className="tpl-line" style={{ background: primary, opacity: 0.3, width: '40%', height: 6, marginBottom: 6 }}></div>
        <div className="tpl-line"></div>
        <div className="tpl-line" style={{ width: '85%' }}></div>
      </div>
    );
  };

  return (
    <div className="template-page">
      <div className="container">
        <div className="template-header">
          <h1>Resume <span className="gradient-text">Templates</span></h1>
          <p>Choose from our collection of professionally designed, ATS-friendly templates</p>
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner"></div></div>
        ) : (
          <div className="template-grid">
            {templates.map(t => {
              let config = {};
              try { config = JSON.parse(t.layout_config); } catch {}
              return (
                <div key={t.id} className="template-card glass-card glass-card-hover">
                  <div className="template-preview">
                    {getTemplatePreview(config)}
                  </div>
                  <div className="template-info">
                    <div className="template-meta">
                      <h3>{t.name}</h3>
                      <span className="badge badge-primary">{t.category}</span>
                    </div>
                    <p>{t.description}</p>
                    <button onClick={() => useTemplate(t.id)} className="btn btn-primary btn-sm use-template-btn">
                      Use This Template →
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
