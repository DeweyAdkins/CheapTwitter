const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

const dbPath = path.resolve(__dirname, 'database.txt');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Set up sessions
app.use(session({
    secret: 'k', // Change this to a random string
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Users routes
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    console.log(`Creating user: ${username}`);

    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (row) {
            console.log('Username already exists:', username);
            res.status(409).json({ error: 'Username already exists' });
        } else {
            db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password], function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('User created successfully:', username);
                    res.status(201).json({ user_id: this.lastID, message: 'User created successfully' });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Attempting login for user: ${username}`);

    db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            console.log('Invalid username or password for user:', username);
            res.status(401).json({ error: 'Invalid username or password' });
        } else {
            // Save user information in the session
            req.session.user = { id: row.user_id, username: row.username };
            console.log('Login successful for user:', username);
            res.status(200).json({ message: 'Login successful', user_id: row.user_id });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
