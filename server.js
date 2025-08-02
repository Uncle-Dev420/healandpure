const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Reference validation regex
const refPattern = /^[A-Za-z0-9]{6,12}$/;

// Serve static files (front-end)
app.use(express.static(__dirname));

// Certificate lookup endpoint
app.get('/api/certificate', (req, res) => {
  const ref = req.query.ref;
  if (!ref || !refPattern.test(ref)) {
    return res.status(404).json({ error: 'Certificate not found.' });
  }
  const certPath = path.join(__dirname, 'certificates', `${ref}.pdf`);
  fs.access(certPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${ref}.pdf"`);
    fs.createReadStream(certPath).pipe(res);
  });
});

// Ensure certificates directory exists
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

app.listen(PORT, () => {
  console.log(`Certificate Portal server running on http://localhost:${PORT}`);
});
