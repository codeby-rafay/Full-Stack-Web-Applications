const db = require('./db');

// Seed templates
const templates = [
  {
    name: 'Modern Minimal',
    description: 'Clean, minimalist design with elegant typography and subtle accents. Perfect for tech professionals.',
    thumbnail: 'modern-minimal',
    category: 'modern',
    layout_config: JSON.stringify({
      id: 'modern-minimal',
      primaryColor: '#6C63FF',
      accentColor: '#2D2B55',
      fontFamily: 'Inter',
      headerStyle: 'left-aligned',
      sectionDivider: 'line',
      showPhoto: false,
      layout: 'single-column'
    })
  },
  {
    name: 'Executive Pro',
    description: 'Bold and professional layout designed for senior-level positions and executive roles.',
    thumbnail: 'executive-pro',
    category: 'professional',
    layout_config: JSON.stringify({
      id: 'executive-pro',
      primaryColor: '#1A1A2E',
      accentColor: '#E94560',
      fontFamily: 'Outfit',
      headerStyle: 'centered',
      sectionDivider: 'bold-line',
      showPhoto: true,
      layout: 'two-column'
    })
  },
  {
    name: 'Creative Studio',
    description: 'Eye-catching design with vibrant colors and creative layout. Great for designers and artists.',
    thumbnail: 'creative-studio',
    category: 'creative',
    layout_config: JSON.stringify({
      id: 'creative-studio',
      primaryColor: '#FF6B6B',
      accentColor: '#4ECDC4',
      fontFamily: 'Outfit',
      headerStyle: 'sidebar',
      sectionDivider: 'dots',
      showPhoto: true,
      layout: 'sidebar'
    })
  },
  {
    name: 'Classic Elegance',
    description: 'Timeless, traditional resume design that works across all industries.',
    thumbnail: 'classic-elegance',
    category: 'traditional',
    layout_config: JSON.stringify({
      id: 'classic-elegance',
      primaryColor: '#2C3E50',
      accentColor: '#3498DB',
      fontFamily: 'Inter',
      headerStyle: 'centered',
      sectionDivider: 'double-line',
      showPhoto: false,
      layout: 'single-column'
    })
  }
];

// Insert templates using INSERT OR IGNORE to avoid duplicates and FK issues
const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO templates (name, description, thumbnail, category, layout_config) 
  VALUES (?, ?, ?, ?, ?)
`);

for (const t of templates) {
  insertStmt.run(t.name, t.description, t.thumbnail, t.category, t.layout_config);
}

console.log(`✅ Seeded ${templates.length} templates successfully!`);
process.exit(0);
