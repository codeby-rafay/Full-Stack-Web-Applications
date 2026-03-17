import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ResumePreview.css";

export default function ResumePreview({ data, layoutConfig = {} }) {
  const resumeRef = useRef(null);

  const {
    primaryColor = "#6C63FF",
    accentColor = "#2D2B55",
    layout = "single-column",
    id: templateId = "modern-minimal",
  } = layoutConfig;

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personalInfo?.fullName || "resume"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = data || {};

  const hasContent =
    personalInfo.fullName || personalInfo.title || experience.length > 0;

  return (
    <div className="preview-wrapper">
      <div
        className={`resume-document resume-${templateId}`}
        ref={resumeRef}
        style={{ "--tpl-primary": primaryColor, "--tpl-accent": accentColor }}
      >
        {!hasContent ? (
          <div className="resume-placeholder">
            <p>Start filling in your details to see the preview</p>
          </div>
        ) : layout === "sidebar" ? (
          /* Sidebar Layout */
          <div className="resume-sidebar-layout">
            <div
              className="resume-sidebar-left"
              style={{ background: primaryColor }}
            >
              {personalInfo.fullName && (
                <div className="sidebar-personal">
                  <div className="sidebar-avatar">
                    {personalInfo.fullName.charAt(0)}
                  </div>
                  <h2>{personalInfo.fullName}</h2>
                  {personalInfo.title && (
                    <p className="sidebar-title">{personalInfo.title}</p>
                  )}
                </div>
              )}
              {(personalInfo.email ||
                personalInfo.phone ||
                personalInfo.location) && (
                <div className="sidebar-contact">
                  <h3>Contact</h3>
                  {personalInfo.email && <p>📧 {personalInfo.email}</p>}
                  {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
                  {personalInfo.location && <p>📍 {personalInfo.location}</p>}
                </div>
              )}
              {skills.length > 0 && (
                <div className="sidebar-skills">
                  <h3>Skills</h3>
                  <div className="sidebar-skill-list">
                    {skills.map((s, i) => (
                      <span key={i} className="sidebar-skill">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="resume-sidebar-right">
              {personalInfo.summary && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor }}
                  >
                    Summary
                  </h3>
                  <p>{personalInfo.summary}</p>
                </div>
              )}
              {experience.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor }}
                  >
                    Experience
                  </h3>
                  {experience.map((exp, i) => (
                    <div key={i} className="resume-entry">
                      <div className="entry-header">
                        <strong>{exp.position}</strong>
                        <span className="entry-date">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      <p className="entry-company">{exp.company}</p>
                      {exp.description && (
                        <p className="entry-desc">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {education.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor }}
                  >
                    Education
                  </h3>
                  {education.map((edu, i) => (
                    <div key={i} className="resume-entry">
                      <div className="entry-header">
                        <strong>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </strong>
                        <span className="entry-date">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                      <p className="entry-company">
                        {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {projects.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor }}
                  >
                    Projects
                  </h3>
                  {projects.map((proj, i) => (
                    <div key={i} className="resume-entry">
                      <strong>{proj.name}</strong>
                      {proj.description && (
                        <p className="entry-desc">{proj.description}</p>
                      )}
                      {proj.technologies && (
                        <p className="entry-tech">Tech: {proj.technologies}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : layout === "two-column" ? (
          /* Two-Column Layout */
          <>
            <div
              className="resume-header-centered"
              style={{ background: primaryColor }}
            >
              {personalInfo.fullName && <h1>{personalInfo.fullName}</h1>}
              {personalInfo.title && (
                <p className="header-title">{personalInfo.title}</p>
              )}
              <div className="header-contact">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>
            <div className="resume-body two-col">
              <div className="col-main">
                {personalInfo.summary && (
                  <div className="resume-section">
                    <h3
                      className="section-heading"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Summary
                    </h3>
                    <p>{personalInfo.summary}</p>
                  </div>
                )}
                {experience.length > 0 && (
                  <div className="resume-section">
                    <h3
                      className="section-heading"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Experience
                    </h3>
                    {experience.map((exp, i) => (
                      <div key={i} className="resume-entry">
                        <div className="entry-header">
                          <strong>{exp.position}</strong>
                          <span className="entry-date">
                            {exp.startDate} — {exp.endDate}
                          </span>
                        </div>
                        <p className="entry-company">{exp.company}</p>
                        {exp.description && (
                          <p className="entry-desc">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {projects.length > 0 && (
                  <div className="resume-section">
                    <h3
                      className="section-heading"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Projects
                    </h3>
                    {projects.map((proj, i) => (
                      <div key={i} className="resume-entry">
                        <strong>{proj.name}</strong>
                        {proj.description && (
                          <p className="entry-desc">{proj.description}</p>
                        )}
                        {proj.technologies && (
                          <p className="entry-tech">
                            Tech: {proj.technologies}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-side">
                {education.length > 0 && (
                  <div className="resume-section">
                    <h3
                      className="section-heading"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Education
                    </h3>
                    {education.map((edu, i) => (
                      <div key={i} className="resume-entry">
                        <strong>{edu.degree}</strong>
                        {edu.field && <p>{edu.field}</p>}
                        <p className="entry-company">{edu.institution}</p>
                        <p className="entry-date">
                          {edu.startDate} — {edu.endDate}
                        </p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {skills.length > 0 && (
                  <div className="resume-section">
                    <h3
                      className="section-heading"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      Skills
                    </h3>
                    <div className="resume-skills-list">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="resume-skill-tag"
                          style={{
                            background: `${accentColor}15`,
                            color: accentColor,
                            borderColor: `${accentColor}30`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Single Column / Default Layout */
          <>
            <div className="resume-header-simple">
              {personalInfo.fullName && (
                <h1 style={{ color: primaryColor }}>{personalInfo.fullName}</h1>
              )}
              {personalInfo.title && (
                <p className="header-title">{personalInfo.title}</p>
              )}
              <div className="header-contact-line">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
            </div>
            <div className="resume-body">
              {personalInfo.summary && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    Professional Summary
                  </h3>
                  <p>{personalInfo.summary}</p>
                </div>
              )}
              {experience.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    Experience
                  </h3>
                  {experience.map((exp, i) => (
                    <div key={i} className="resume-entry">
                      <div className="entry-header">
                        <strong>{exp.position}</strong>
                        <span className="entry-date">
                          {exp.startDate} — {exp.endDate}
                        </span>
                      </div>
                      <p className="entry-company">{exp.company}</p>
                      {exp.description && (
                        <p className="entry-desc">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {education.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    Education
                  </h3>
                  {education.map((edu, i) => (
                    <div key={i} className="resume-entry">
                      <div className="entry-header">
                        <strong>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </strong>
                        <span className="entry-date">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                      <p className="entry-company">
                        {edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {skills.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    Skills
                  </h3>
                  <div className="resume-skills-list">
                    {skills.map((s, i) => (
                      <span key={i} className="resume-skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {projects.length > 0 && (
                <div className="resume-section">
                  <h3
                    className="section-heading"
                    style={{ color: primaryColor, borderColor: primaryColor }}
                  >
                    Projects
                  </h3>
                  {projects.map((proj, i) => (
                    <div key={i} className="resume-entry">
                      <strong>{proj.name}</strong>
                      {proj.description && (
                        <p className="entry-desc">{proj.description}</p>
                      )}
                      {proj.technologies && (
                        <p className="entry-tech">Tech: {proj.technologies}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <button
        onClick={downloadPDF}
        className="btn btn-accent btn-sm download-btn"
      >
        📥 Download PDF
      </button>
    </div>
  );
}
