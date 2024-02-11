const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Paths
const dbPath = path.join(__dirname, 'db/db.json');
const publicPath = path.join(__dirname, 'public');

// Serve static files from the public directory
app.use(express.static(publicPath));

// Parse JSON requests
app.use(express.json());

// Function to generate a simple unique identifier
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Get all notes from db.json
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json(notes);
});

// Save a new note to db.json
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Assign a unique id to the new note using the generateUniqueId function
    newNote.id = generateUniqueId();

    notes.push(newNote);
    fs.writeFileSync(dbPath, JSON.stringify(notes));

    res.json(newNote);
});

// Serve notes.html for the /notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(publicPath, 'notes.html'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
