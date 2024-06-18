const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Use bodyParser to parse application/json
app.use(bodyParser.json());

// Use express-session for managing sessions
app.use(session({
    secret: 'your_secret_key', // Use a secure random secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Database setup
const db = new sqlite3.Database('./mydatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        email TEXT UNIQUE,
        password TEXT,
        age INTEGER,
        gender TEXT,
        description TEXT,
        photo TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS strategy_templates (
        template_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        strategy_name TEXT,
        template_content TEXT,
        creation_date TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
});

// Register new user
app.post('/register', (req, res) => {
    const { firstname, lastname, email, password, age, gender, description, photo } = req.body;
    const sql = `INSERT INTO users (firstname, lastname, email, password, age, gender, description, photo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [firstname, lastname, email, password, age, gender, description, photo], function (err) {
        if (err) {
            res.status(500).json({ error: 'Could not register user: ' + err.message });
        } else {
            res.json({ message: 'User registered successfully!', id: this.lastID });
        }
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT id, firstname, lastname, email, age, gender, description, photo FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (user) {
            req.session.user = user; // Store user details in session
            res.json({ message: 'Logged in successfully', user: user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ error: 'Logout failed', error: err });
        } else {
            res.status(200).json({ message: 'Logged out successfully' });
        }
    });
});

// Update user details
app.post('/update-user', (req, res) => {
    const { age, gender, description, photo } = req.body;
    if (req.session.user && req.session.user.id) {
        const sql = `UPDATE users SET age = ?, gender = ?, description = ?, photo = ? WHERE id = ?`;
        db.run(sql, [age, gender, description, photo, req.session.user.id], function(err) {
            if (err) {
                res.status(500).json({ error: 'Could not update user: ' + err.message });
            } else {
                res.json({ message: 'User updated successfully' });
            }
        });
    } else {
        res.status(403).json({ error: 'Not logged in' });
    }
});

// Check if user is logged in
app.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.json({ isLoggedIn: true, user: req.session.user });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// Endpoint to download a template
app.get('/download-template/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const templateId = req.params.id;
    const userId = req.session.user.id;
    const sql = `SELECT strategy_name, template_content FROM strategy_templates WHERE template_id = ? AND user_id = ?`;

    db.get(sql, [templateId, userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ strategyName: row.strategy_name, templateContent: row.template_content });
        } else {
            res.status(404).json({ error: 'Template not found' });
        }
    });
});

// Endpoint to save a template
app.post('/save-template', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const { strategyName, templateContent } = req.body;
    const userId = req.session.user.id;
    const sql = `INSERT INTO strategy_templates (user_id, strategy_name, template_content, creation_date) VALUES (?, ?, ?, datetime('now'))`;

    db.run(sql, [userId, strategyName, templateContent], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Template saved successfully', templateId: this.lastID });
    });
});

// Endpoint to get user templates
app.get('/get-templates', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.user.id;
    const sql = `SELECT template_id, strategy_name, creation_date FROM strategy_templates WHERE user_id = ?`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ templates: rows });
    });
});

// Endpoint to delete a template
app.delete('/delete-template/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const templateId = req.params.id;
    const userId = req.session.user.id;
    const sql = `DELETE FROM strategy_templates WHERE template_id = ? AND user_id = ?`;

    db.run(sql, [templateId, userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes > 0) {
            res.json({ message: 'Template deleted successfully' });
        } else {
            res.status(404).json({ error: 'Template not found or not owned by user' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
