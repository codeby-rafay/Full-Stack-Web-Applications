import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext, ToastContext } from '../App';
import ResumePreview from '../components/ResumePreview';
import './ResumeEditor.css';

const emptyResume = {
  personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: []
};

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, API_URL } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [resumeTitle, setResumeTitle] = useState('Untitled Resume');
  const [templateId, setTemplateId] = useState(1);
  const [data, setData] = useState(emptyResume);
  const [templates, setTemplates] = useState([]);
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const saveTimeout = useRef(null);

  useEffect(() => {
    fetchTemplates();
    if (id && id !== 'new') {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/templates`);
      const tpls = await res.json();
      if (res.ok) setTemplates(tpls);
    } catch {}
  };

  const fetchResume = async () => {
    try {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resume = await res.json();
      if (res.ok) {
        setResumeTitle(resume.title);
        setTemplateId(resume.template_id);
        try { setData(JSON.parse(resume.data)); } catch { setData(emptyResume); }
        setAtsResult(resume.ats_score > 0 ? { score: resume.ats_score, feedback: JSON.parse(resume.ats_feedback || '[]') } : null);
      }
    } catch (err) {
      addToast('Failed to load resume', 'error');
    }
    setLoading(false);
  };

  const autoSave = (newData) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveResume(newData), 1500);
  };

  const saveResume = async (saveData) => {
    if (!id || id === 'new') return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: resumeTitle,
          template_id: templateId,
          data: saveData || data,
          ats_score: atsResult?.score || 0,
          ats_feedback: atsResult?.feedback || []
        })
      });
    } catch (err) {
      console.error('Auto-save failed', err);
    }
    setSaving(false);
  };

  const checkATS = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resumeData: data }) // Use the current 'data' state for analysis
      });
      const result = await res.json();
      if (res.ok) {
        setAtsResult(result);
        addToast(`ATS Score: ${result.score}%`, 'success');
        // Save immediately after analysis
        await fetch(`${API_URL}/resumes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: resumeTitle,
            template_id: templateId,
            data: data, // Use the current 'data' state
            ats_score: result.score,
            ats_feedback: result.feedback
          })
        });
      } else {
        addToast(result.message || 'ATS analysis failed', 'error');
      }
    } catch (err) {
      addToast('ATS analysis failed', 'error');
    }
    setAnalyzing(false);
  };

  const updatePersonalInfo = (field, value) => {
    const newData = { ...data, personalInfo: { ...data.personalInfo, [field]: value } };
    setData(newData);
    autoSave(newData);
  };

  const addExperience = () => {
    const newData = {
      ...data,
      experience: [...data.experience, { company: '', position: '', startDate: '', endDate: '', description: '' }]
    };
    setData(newData);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    const newData = { ...data, experience: updated };
    setData(newData);
    autoSave(newData);
  };

  const removeExperience = (index) => {
    const newData = { ...data, experience: data.experience.filter((_, i) => i !== index) };
    setData(newData);
    autoSave(newData);
  };

  const addEducation = () => {
    const newData = {
      ...data,
      education: [...data.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]
    };
    setData(newData);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    const newData = { ...data, education: updated };
    setData(newData);
    autoSave(newData);
  };

  const removeEducation = (index) => {
    const newData = { ...data, education: data.education.filter((_, i) => i !== index) };
    setData(newData);
    autoSave(newData);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const newData = { ...data, skills: [...data.skills, newSkill.trim()] };
    setData(newData);
    setNewSkill('');
    autoSave(newData);
  };

  const removeSkill = (index) => {
    const newData = { ...data, skills: data.skills.filter((_, i) => i !== index) };
    setData(newData);
    autoSave(newData);
  };

  const addProject = () => {
    const newData = {
      ...data,
      projects: [...data.projects, { name: '', description: '', technologies: '' }]
    };
    setData(newData);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    const newData = { ...data, projects: updated };
    setData(newData);
    autoSave(newData);
  };

  const removeProject = (index) => {
    const newData = { ...data, projects: data.projects.filter((_, i) => i !== index) };
    setData(newData);
    autoSave(newData);
  };

  const handleTitleSave = () => {
    saveResume(data);
  };

  const sections = [
    { key: 'personal', label: 'Personal Info', icon: '👤' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🚀' },
    { key: 'template', label: 'Template', icon: '🎨' },
  ];

  if (loading) {
    return <div className="loading-page"><div className="spinner"></div></div>;
  }

  const currentTemplate = templates.find(t => t.id === templateId);
  let layoutConfig = {};
  try { layoutConfig = currentTemplate ? JSON.parse(currentTemplate.layout_config) : {}; } catch {}

  return (
    <div className="editor-page">
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm">
            ← Back
          </button>
          <input
            className="editor-title-input"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            onBlur={handleTitleSave}
            placeholder="Resume Title"
          />
        </div>
        <div className="editor-topbar-right">
          <button onClick={checkATS} className="btn btn-accent btn-sm" disabled={analyzing}>
            {analyzing ? '⌛ Analyzing...' : '🤖 Check ATS Score'}
          </button>
          {saving && <span className="save-indicator">Saving...</span>}
          <button onClick={() => saveResume(data)} className="btn btn-primary btn-sm">
            💾 Save
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Sidebar Navigation */}
        <div className="editor-sidebar">
          {sections.map(s => (
            <button
              key={s.key}
              className={`sidebar-btn ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              <span className="sidebar-icon">{s.icon}</span>
              <span className="sidebar-label">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Panel */}
        <div className="editor-form">
          {activeSection === 'personal' && (
            <div className="form-section">
              <h2 className="form-section-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="input-field" placeholder="John Doe" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input className="input-field" placeholder="Software Engineer" value={data.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="input-field" type="email" placeholder="john@example.com" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="input-field" placeholder="+1 (555) 123-4567" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                </div>
                <div className="form-group full-width">
                  <label>Location</label>
                  <input className="input-field" placeholder="City, State" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                </div>
                <div className="form-group full-width">
                  <label>Professional Summary</label>
                  <textarea className="input-field textarea" rows="4" placeholder="A brief summary of your professional background..." value={data.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="form-section">
              <div className="form-section-header">
                <h2 className="form-section-title">Work Experience</h2>
                <button onClick={addExperience} className="btn btn-primary btn-sm">+ Add</button>
              </div>
              {data.experience.length === 0 && (
                <div className="empty-section">
                  <p>No experience added yet. Click "Add" to get started.</p>
                </div>
              )}
              {data.experience.map((exp, i) => (
                <div key={i} className="form-entry glass-card">
                  <div className="form-entry-header">
                    <span className="entry-number">#{i + 1}</span>
                    <button onClick={() => removeExperience(i)} className="btn btn-danger btn-sm">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Company</label>
                      <input className="input-field" placeholder="Company name" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <input className="input-field" placeholder="Job title" value={exp.position} onChange={(e) => updateExperience(i, 'position', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input className="input-field" placeholder="Jan 2022" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input className="input-field" placeholder="Present" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea className="input-field textarea" rows="3" placeholder="Describe your achievements..." value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'education' && (
            <div className="form-section">
              <div className="form-section-header">
                <h2 className="form-section-title">Education</h2>
                <button onClick={addEducation} className="btn btn-primary btn-sm">+ Add</button>
              </div>
              {data.education.length === 0 && (
                <div className="empty-section">
                  <p>No education added yet. Click "Add" to get started.</p>
                </div>
              )}
              {data.education.map((edu, i) => (
                <div key={i} className="form-entry glass-card">
                  <div className="form-entry-header">
                    <span className="entry-number">#{i + 1}</span>
                    <button onClick={() => removeEducation(i)} className="btn btn-danger btn-sm">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Institution</label>
                      <input className="input-field" placeholder="University name" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Degree</label>
                      <input className="input-field" placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input className="input-field" placeholder="Computer Science" value={edu.field} onChange={(e) => updateEducation(i, 'field', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>GPA</label>
                      <input className="input-field" placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => updateEducation(i, 'gpa', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Start Year</label>
                      <input className="input-field" placeholder="2018" value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>End Year</label>
                      <input className="input-field" placeholder="2022" value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="form-section">
              <h2 className="form-section-title">Skills</h2>
              <div className="skills-input-row">
                <input
                  className="input-field"
                  placeholder="Type a skill and press Enter"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button onClick={addSkill} className="btn btn-primary btn-sm">Add</button>
              </div>
              <div className="skills-list">
                {data.skills.map((skill, i) => (
                  <div key={i} className="skill-chip">
                    {skill}
                    <button onClick={() => removeSkill(i)} className="skill-remove">×</button>
                  </div>
                ))}
              </div>
              {data.skills.length === 0 && (
                <div className="empty-section">
                  <p>No skills added yet. Type a skill above and hit Enter.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="form-section">
              <div className="form-section-header">
                <h2 className="form-section-title">Projects</h2>
                <button onClick={addProject} className="btn btn-primary btn-sm">+ Add</button>
              </div>
              {data.projects.length === 0 && (
                <div className="empty-section">
                  <p>No projects added yet. Click "Add" to get started.</p>
                </div>
              )}
              {data.projects.map((proj, i) => (
                <div key={i} className="form-entry glass-card">
                  <div className="form-entry-header">
                    <span className="entry-number">#{i + 1}</span>
                    <button onClick={() => removeProject(i)} className="btn btn-danger btn-sm">Remove</button>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Project Name</label>
                      <input className="input-field" placeholder="Project name" value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea className="input-field textarea" rows="2" placeholder="Describe the project..." value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
                    </div>
                    <div className="form-group full-width">
                      <label>Technologies Used</label>
                      <input className="input-field" placeholder="React, Node.js, SQL" value={proj.technologies} onChange={(e) => updateProject(i, 'technologies', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'template' && (
            <div className="form-section">
              <h2 className="form-section-title">Choose Template</h2>
              <div className="template-picker">
                {templates.map(t => {
                  let config = {};
                  try { config = JSON.parse(t.layout_config); } catch {}
                  return (
                    <div
                      key={t.id}
                      className={`template-pick-card glass-card ${templateId === t.id ? 'active' : ''}`}
                      onClick={() => { setTemplateId(t.id); autoSave(data); }}
                    >
                      <div className="template-pick-preview" style={{ borderTop: `3px solid ${config.primaryColor || '#6C63FF'}` }}>
                        <div className="mini-line mini-line-md" style={{ background: config.primaryColor || '#6C63FF', opacity: 0.5 }}></div>
                        <div className="mini-line mini-line-full"></div>
                        <div className="mini-line mini-line-lg"></div>
                        <div className="mini-line mini-line-full"></div>
                      </div>
                      <h4>{t.name}</h4>
                      <p>{t.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ATS Feedback Section always visible at bottom of form if result exists */}
          {atsResult && (
            <div className="ats-panel glass-card">
              <div className="ats-panel-header">
                <h3>ATS Analysis</h3>
                <div className={`ats-score-circle ${atsResult.score > 80 ? 'good' : atsResult.score > 50 ? 'avg' : 'poor'}`}>
                  {atsResult.score}%
                </div>
              </div>
              <div className="ats-feedback-list">
                {atsResult.feedback.map((item, i) => (
                  <div key={i} className={`ats-feedback-item ${item.type}`}>
                    <span className="feedback-icon">{item.type === 'positive' ? '✓' : item.type === 'negative' ? '✕' : '•'}</span>
                    <p>{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="editor-preview">
          <div className="preview-header">
            <h3>Live Preview</h3>
          </div>
          <div className="preview-content">
            <ResumePreview data={data} layoutConfig={layoutConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
