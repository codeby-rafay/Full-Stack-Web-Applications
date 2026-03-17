const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate resume content with AI
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { jobTitle, experience, skills, education, description } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return sample generated data when no API key is configured
      return res.json({
        generated: true,
        fallback: true,
        data: generateFallbackResume(jobTitle, experience, skills, education, description)
      });
    }

    const prompt = buildPrompt(jobTitle, experience, skills, education, description);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.json({
        generated: true,
        fallback: true,
        data: generateFallbackResume(jobTitle, experience, skills, education, description)
      });
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.json({
        generated: true,
        fallback: true,
        data: generateFallbackResume(jobTitle, experience, skills, education, description)
      });
    }

    // Parse the JSON from the AI response
    let resumeData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      resumeData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      resumeData = null;
    }

    if (!resumeData) {
      return res.json({
        generated: true,
        fallback: true,
        data: generateFallbackResume(jobTitle, experience, skills, education, description)
      });
    }

    res.json({
      generated: true,
      fallback: false,
      data: resumeData
    });
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'Failed to generate resume content' });
  }
});

// Analyze resume for ATS score and feedback
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback analysis when no API key is configured
      const score = calculateMockATSScore(resumeData);
      return res.json({
        score,
        feedback: generateMockFeedback(score),
        fallback: true
      });
    }

    const prompt = buildAnalysisPrompt(resumeData);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Lower temperature for more consistent scoring
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) {
      const score = calculateMockATSScore(resumeData);
      return res.json({
        score,
        feedback: generateMockFeedback(score),
        fallback: true
      });
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      const score = calculateMockATSScore(resumeData);
      return res.json({ score, feedback: generateMockFeedback(score), fallback: true });
    }

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseErr) {
      analysis = null;
    }

    if (!analysis || typeof analysis.score !== 'number') {
      const score = calculateMockATSScore(resumeData);
      return res.json({ score, feedback: generateMockFeedback(score), fallback: true });
    }

    res.json(analysis);
  } catch (err) {
    console.error('ATS analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

function buildAnalysisPrompt(data) {
  return `Analyze the following resume data for ATS (Applicant Tracking System) compatibility and professional impact. 
Return ONLY a valid JSON object with the following structure:
{
  "score": 85, // A score from 0 to 100
  "feedback": [
    { "type": "positive", "message": "Great use of action verbs" },
    { "type": "negative", "message": "Missing contact information" },
    { "type": "neutral", "message": "Consider adding more keywords for your industry" }
  ]
}

Resume Data:
${JSON.stringify(data, null, 2)}

Evaluate based on:
1. Content completeness (Contact, Summary, Experience, Education, Skills).
2. Actionerable impact in experience descriptions.
3. Skill diversity.
4. Professional tone.`;
}

function calculateMockATSScore(data) {
  let score = 40;
  if (data.personalInfo?.fullName) score += 10;
  if (data.personalInfo?.summary) score += 10;
  if (data.experience?.length > 0) score += 10;
  if (data.education?.length > 0) score += 10;
  if (data.skills?.length > 5) score += 10;
  if (data.projects?.length > 1) score += 10;
  return Math.min(score, 100);
}

function generateMockFeedback(score) {
  const feedback = [];
  if (score < 60) feedback.push({ type: 'negative', message: 'Resume is missing critical sections or content.' });
  if (score >= 60) feedback.push({ type: 'positive', message: 'Basic sections are present and well-structured.' });
  if (score > 80) feedback.push({ type: 'positive', message: 'Excellent detail and professional presentation.' });
  feedback.push({ type: 'neutral', message: 'Add specific quantifiable achievements to improve score.' });
  feedback.push({ type: 'neutral', message: 'Ensure your skills match the job descriptions you apply for.' });
  return feedback;
}

function buildPrompt(jobTitle, experience, skills, education, description) {
  return `Generate professional resume content for the following profile. Return ONLY a valid JSON object with no markdown formatting, no code blocks, just raw JSON.

Job Title: ${jobTitle}
Years of Experience: ${experience || 'Not specified'}
Key Skills: ${skills || 'Not specified'}
Education: ${education || 'Not specified'}
Additional Info: ${description || 'None'}

Return this exact JSON structure:
{
  "personalInfo": {
    "fullName": "A professional name",
    "title": "${jobTitle}",
    "email": "professional@email.com",
    "phone": "+1 (555) 000-0000",
    "location": "City, State",
    "summary": "A compelling 2-3 sentence professional summary"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Month Year",
      "endDate": "Present",
      "description": "2-3 bullet points describing achievements and responsibilities, separated by newlines"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "startDate": "Year",
      "endDate": "Year",
      "gpa": "3.8/4.0"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief project description with impact",
      "technologies": "Tech used"
    }
  ]
}

Generate realistic, impressive content appropriate for a ${jobTitle} with ${experience || 'some'} years of experience. Make the summary compelling and the experience entries achievement-oriented with quantifiable results.`;
}

function generateFallbackResume(jobTitle, experience, skills, education, description) {
  const skillList = skills ? skills.split(',').map(s => s.trim()) : ['Communication', 'Problem Solving', 'Team Leadership', 'Project Management'];
  
  return {
    personalInfo: {
      fullName: 'Your Name',
      title: jobTitle,
      email: 'your.email@example.com',
      phone: '+1 (555) 000-0000',
      location: 'City, State',
      summary: `Results-driven ${jobTitle} with ${experience || 'several'} years of experience delivering high-impact solutions. Proven track record of driving innovation and leading cross-functional teams to exceed business objectives. Passionate about leveraging cutting-edge technologies to solve complex challenges.`
    },
    experience: [
      {
        company: 'Tech Company Inc.',
        position: `Senior ${jobTitle}`,
        startDate: 'Jan 2022',
        endDate: 'Present',
        description: `• Led a team of 8 professionals in delivering enterprise-scale projects, resulting in 40% improvement in delivery efficiency\n• Spearheaded the implementation of modern best practices, reducing technical debt by 35%\n• Collaborated with stakeholders to define product roadmap and strategic initiatives`
      },
      {
        company: 'Innovation Corp',
        position: jobTitle,
        startDate: 'Jun 2019',
        endDate: 'Dec 2021',
        description: `• Developed and maintained critical systems serving 100K+ daily active users\n• Implemented automated testing pipeline, achieving 95% code coverage\n• Mentored junior team members and conducted technical knowledge-sharing sessions`
      }
    ],
    education: [
      {
        institution: education || 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.7/4.0'
      }
    ],
    skills: skillList,
    projects: [
      {
        name: 'Enterprise Platform Redesign',
        description: 'Led the complete redesign of the company\'s flagship platform, improving user engagement by 60% and reducing load times by 45%',
        technologies: skillList.slice(0, 3).join(', ')
      },
      {
        name: 'Automated Analytics Dashboard',
        description: 'Built a real-time analytics dashboard that provided actionable insights to 50+ business stakeholders',
        technologies: skillList.slice(1, 4).join(', ')
      }
    ]
  };
}

module.exports = router;
