const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const { getCartIdOrCreate, getCartById, addToCart, removeFromCart } = require('./functions/cart');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
    const { sortField } = req.query;
    const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : 0;
    const offset = (page - 1) * pageSize;

    try {
        const query = await db.query(`
            SELECT * FROM products
            ORDER BY ${sortField ?? 'id'} ${sortOrder === 1 ? 'ASC' : 'DESC'}
            LIMIT $1 OFFSET $2`,
            [pageSize, offset]
        );

        const countResult = await db.query(`
            SELECT COUNT(*)::int AS total
            FROM products;`
        );

        res.json({
            products: query.rows,
            total: countResult.rows[0].total,
            page,
            pageSize
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
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
        const cartResult = await getCartIdOrCreate(req.identity);

        const cartId = cartResult.id;

        const cartItems = await db.query(`
            SELECT
                p.id,
                p.name,
                p.description,
                p.images,
                p.price,
                ci.quantity,
                (p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1;`,
            [cartId]
        );

        const totalResult = await db.query(`
            SELECT COALESCE(SUM(p.price * ci.quantity), 0) AS cart_total
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1
        `, [cartId]);

        res.json({
            products: cartItems.rows,
            total: totalResult.rows[0].cart_total
        });
    } catch (error) {
        console.error(error);
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

        const cartResult = await getCartIdOrCreate(req.identity);

        await addToCart(cartResult.id, productId, 1);

        const updatedCart = await getCartById(req.identity);

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        const cartResult = await getCartIdOrCreate(req.identity);

        await removeFromCart(cartResult.id, productId);

        const updatedCart = await getCartById(req.identity);

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});
