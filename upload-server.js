const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'heal-and-pure-secret',
  resave: false,
  saveUninitialized: true,
}));

// Ensure certificates directory exists
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

// Multer storage config: save as [number].pdf
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, certDir);
  },
  filename: function (req, file, cb) {
    const certNumber = req.body.certNumber;
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, certNumber + ext);
  }
});

const upload = multer({ storage: storage });

// Serve certificates statically
app.use('/certificates', express.static(certDir));

// Admin login route
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.isAdmin = true;
    res.send({ success: true, message: 'Login successful' });
  } else {
    res.status(401).send({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware to check admin login
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).send('Unauthorized. Please log in as admin.');
  }
}

// Admin upload form (protected)
app.get('/admin-upload', requireAdmin, (req, res) => {
  res.send(`
    <h2>Upload Certificate</h2>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="text" name="certNumber" placeholder="Certificate Number" required><br><br>
      <input type="file" name="certificate" accept="application/pdf,image/*" required><br><br>
      <button type="submit">Upload</button>
    </form>
    <form method="POST" action="/admin-logout" style="margin-top:20px;">
      <button type="submit">Logout</button>
    </form>
  `);
});

// Handle upload (protected)
app.post('/upload', requireAdmin, upload.single('certificate'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('Certificate uploaded successfully! <a href="/admin-upload">Upload another</a>');
});

// Admin logout
app.post('/admin-logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin-upload');
  });
});

app.listen(PORT, () => {
  console.log(`Certificate upload server running at http://localhost:${PORT}/admin-upload`);
});
