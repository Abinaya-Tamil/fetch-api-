const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'docs')));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'login',
    password: '1412',
    port: 5433,
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.get('/api/result', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // Get limit from query parameter

        // Count Query
        const countResult = await pool.query('SELECT COUNT(*) FROM "user"');
        const count = countResult.rows[0].count;

        // Rows Query
        const rowsResult = await pool.query('SELECT * FROM "user" LIMIT $1', [limit]);
        res.json({ status: 'success', count, rows: rowsResult.rows });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 4028;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
