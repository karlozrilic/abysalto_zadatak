const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get('/api/products', async (req, res) => {
    const query = await db.query(`
        SELECT * FROM products
        ORDER BY id ASC     
    `);
    res.json({ products: query.rows });
});

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});
