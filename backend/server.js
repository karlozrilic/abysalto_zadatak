const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const { getCartOrCreate, addToCart, removeFromCart } = require('./functions/cart');

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
        const guestId = req.headers['x-guest-id'];
        if (!guestId) {
            return res.status(401).json({ error: 'Missing guest id' });
        }
        req.identity = { type: 'guest', id: req.headers['x-guest-id'] };
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token (simplified)
    if (token === 'secret-token') {
        // Authentication successful
        req.identity = { type: 'user', id: 123, username: 'john' };
        return next();
    } else {
        return res.status(403).send('Invalid token');
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

app.get('/api/products/:id', async (req, res) => {
    const productId = req.query.id;
    const query = await db.query(`
        SELECT * FROM products
        WHERE id = $1
        LIMIT 1;
        `,
        [productId]
    );
    res.json({ products: query.rows });
});

app.get('/api/cart', authenticate, async (req, res) => {
    try {
        const cartResult = await getCartOrCreate(req.identity);

        const cartId = cartResult.id;

        const cartItems = await db.query(`
            SELECT
                p.id,
                p.name,
                p.description,
                p.images,
                p.price,
                ci.quantity,
                (p.price * ci.quantity) AS total_price
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1;`,
            [cartId]
        );

        res.json({ products: cartItems.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/cart/add', authenticate, async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                error: 'productId is required'
            });
        }

        const cartResult = await getCartOrCreate(req.identity);

        await addToCart(cartResult.id, productId, 1);

        res.json({ message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cart/remove', authenticate, async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                error: 'productId is required'
            });
        }

        const cartResult = await getCartOrCreate(req.identity);

        await removeFromCart(cartResult.id, productId);

        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});
