// Vercel serverless function for handling clean URLs
export default function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Map clean URLs to HTML files
  const urlMap = {
    '/login': '/login.html',
    '/admin': '/admin.html',
    '/news': '/news.html',
    '/projects': '/projects.html',
    '/services': '/services.html'
  };
  
  const targetFile = urlMap[pathname];
  
  if (targetFile) {
    // Redirect to the HTML file
    res.redirect(302, targetFile);
  } else {
    // Return 404 for unmatched routes
    res.status(404).json({ error: 'Page not found' });
  }
}
