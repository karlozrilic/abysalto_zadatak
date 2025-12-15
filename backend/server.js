const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log('Middleware 1: This always runs');
    next();
});

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    // For the purpose of this app if there is no authorization header user is guest
    if (!authHeader) {
        req.identity = { type: 'guest', id: req.headers['x-guest-id'] };
        next();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token (simplified)
    if (token === 'secret-token') {
        // Authentication successful
        req.identity = { type: 'user', id: 123, username: 'john' };
        next();
    } else {
        res.status(403).send('Invalid token');
    }
}

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

app.get('/api/cart', authenticate, async (req, res) => {
    const { type, id } = req.identity;

    if (type === 'user') {
      // logged in
    } else {
      // guest logic
    }
    const query = await db.query(`
        SELECT * FROM carts
        ORDER BY id ASC
    `);
    res.json({ products: query.rows });
});

app.post('/api/cart/add', authenticate, async (req, res) => {
    try {
        const userId = req.identity.id;
        const { productId } = req.body;

        if (!productId) {
        return res.status(400).json({
            error: 'productId is required'
        });
        }

        // TODO pass identity
        await addToCart(userId, productId);

        res.json({ message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/cart/remove', authenticate, async (req, res) => {
    try {
        const userId = req.identity.id;
        const { productId } = req.body;

        if (!productId) {
        return res.status(400).json({
            error: 'productId is required'
        });
        }

        // TODO pass identity
        await removeFromCart(userId, productId);

        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});
