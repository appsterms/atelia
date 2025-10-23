const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('.'));

// Route for clean URLs (without .html extension)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'news.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('Atelia Built - Development Server');
    console.log('========================================');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('');
    console.log('Clean URLs:');
    console.log(`Main Page: http://localhost:${PORT}/`);
    console.log(`Login: http://localhost:${PORT}/login`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`News: http://localhost:${PORT}/news`);
    console.log(`Projects: http://localhost:${PORT}/projects`);
    console.log(`Services: http://localhost:${PORT}/services`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('========================================');
});
