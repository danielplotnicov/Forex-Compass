const express = require('express');
const session = require('express-session');
const Net = require('net');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// const currencyPairs = ['EURUSD', 'GBPUSD', 'USDCHF', 'USDJPY', 'AUDUSD', 'NZDUSD', 'USDCAD'];
// let forexData = {};
//
// // Initialize forexData with loading state
// currencyPairs.forEach(symbol => {
//     forexData[symbol] = { ask: 'Loading...', bid: 'Loading...' };
// });
//
// // Function to get quotes from a server
// function getQuoteFromServer(symbol) {
//     const client_cmd = new Net.Socket();
//
//     client_cmd.connect(77, 'localhost', function () {
//         const JSONobj = { MSG: 'QUOTE', SYMBOL: symbol };
//         client_cmd.write(JSON.stringify(JSONobj) + '\r\n');
//     });
//
//     client_cmd.on('data', function (chunk) {
//         try {
//             const JSONresult = JSON.parse(chunk.toString());
//             forexData[symbol].ask = JSONresult['ASK'];
//             forexData[symbol].bid = JSONresult['BID'];
//         } catch (error) {
//             forexData[symbol].ask = 'Error';
//             forexData[symbol].bid = 'Error';
//         }
//         client_cmd.end();
//     });
//
//     client_cmd.on('error', (err) => {
//         forexData[symbol].ask = 'Error';
//         forexData[symbol].bid = 'Error';
//     });
// }
//
// // Update quotes periodically
// function updateQuotes() {
//     currencyPairs.forEach(symbol => {
//         getQuoteFromServer(symbol);
//     });
// }
//
// // Initial call and setting an interval to update quotes every 5 seconds
// updateQuotes();
// setInterval(updateQuotes, 5000);
//
// // WebSocket server on port 8080
// const wss = new WebSocket.Server({ port: 8080 });
//
// wss.on('connection', (ws) => {
//     console.log('New WebSocket client connected');
//     ws.send(JSON.stringify(forexData));
//
//     const interval = setInterval(() => {
//         ws.send(JSON.stringify(forexData));
//     }, 5000);
//
//     ws.on('close', () => {
//         clearInterval(interval);
//     });
// });


const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

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
});

// Serve static files
app.use(express.static('public'));

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

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
