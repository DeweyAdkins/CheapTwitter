const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

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

// Users routes
app.post('/users', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (row) {
            res.status(409).json({ error: 'Username already exists' });
        } else {
            db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password], function (err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    res.status(201).json({ user_id: this.lastID, message: 'User created successfully' });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(401).json({ error: 'Invalid username or password' });
        } else {
            res.status(200).json({ message: 'Login successful', user_id: row.user_id });
        }
    });
});

app.get('/users/:id', (req, res) => {
    const user_id = req.params.id;
    db.get('SELECT * FROM Users WHERE user_id = ?', [user_id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const user_id = req.params.id;
    db.run('DELETE FROM Users WHERE user_id = ?', [user_id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted successfully' });
        }
    });
});

// Posts routes
app.post('/posts', (req, res) => {
    const { user_id, content } = req.body;
    db.run('INSERT INTO Posts (user_id, content) VALUES (?, ?)', [user_id, content], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ post_id: this.lastID, message: 'Post created successfully' });
        }
    });
});

app.get('/posts/:id', (req, res) => {
    const post_id = req.params.id;
    db.get('SELECT * FROM Posts WHERE post_id = ?', [post_id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json(row);
        }
    });
});

app.get('/users/:user_id/posts/:post_id', (req, res) => {
    const { user_id, post_id } = req.params;
    db.get('SELECT * FROM Posts WHERE user_id = ? AND post_id = ?', [user_id, post_id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.json(row);
        }
    });
});

// Photos routes
app.post('/photos', (req, res) => {
    const { user_id, photo_url } = req.body;
    db.run('INSERT INTO Photos (user_id, photo_url) VALUES (?, ?)', [user_id, photo_url], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ photo_id: this.lastID, message: 'Photo uploaded successfully' });
        }
    });
});

app.get('/photos/:id', (req, res) => {
    const photo_id = req.params.id;
    db.get('SELECT * FROM Photos WHERE photo_id = ?', [photo_id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Photo not found' });
        } else {
            res.json(row);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
