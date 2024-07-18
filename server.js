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

// Migrate the database schema to add 'handle' column if it doesn't exist
db.serialize(() => {
    // Check if the 'Users' table already has the 'handle' column
    db.all("PRAGMA table_info(Users);", (err, rows) => {
        if (err) {
            console.error('Error fetching table info:', err.message);
        } else if (!rows.some(col => col.name === 'handle')) {
            // Only run migration if 'handle' column does not exist
            console.log('Migrating database schema...');
            db.run("CREATE TABLE IF NOT EXISTS UsersTemp (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, handle TEXT NOT NULL)", [], function(err) {
                if (err) {
                    console.error('Error creating UsersTemp table:', err.message);
                    return;
                }

                db.run("INSERT INTO UsersTemp (user_id, username, password, handle) SELECT user_id, username, password, '@' || username FROM Users", [], function(err) {
                    if (err) {
                        console.error('Error inserting into UsersTemp:', err.message);
                        return;
                    }

                    db.run("DROP TABLE Users", [], function(err) {
                        if (err) {
                            console.error('Error dropping Users table:', err.message);
                            return;
                        }

                        db.run("ALTER TABLE UsersTemp RENAME TO Users", [], function(err) {
                            if (err) {
                                console.error('Error renaming UsersTemp to Users:', err.message);
                                return;
                            }

                            console.log('Database schema migration completed.');
                        });
                    });
                });
            });
        } else {
            console.log('No migration needed. Schema is up to date.');
        }
    });
});

app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Set up sessions
app.use(session({
    secret: 'k', // Simple key for internal project
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Users routes
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    console.log(`Creating user: ${username}`);
    const handle = `@${username}`;

    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (row) {
            console.log('Username already exists:', username);
            res.status(409).json({ error: 'Username already exists' });
        } else {
            db.run('INSERT INTO Users (username, password, handle) VALUES (?, ?, ?)', [username, password, handle], function (err) {
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
            req.session.user = { id: row.user_id, username: row.username, handle: row.handle };
            console.log('Login successful for user:', username);
            res.status(200).json({ message: 'Login successful', user: req.session.user });
        }
    });
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('indexlog.html'); // Redirect to login page if not authenticated
    }
}

// Apply isAuthenticated middleware to protected routes
app.get('/index.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get user info
app.get('/user-info', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
