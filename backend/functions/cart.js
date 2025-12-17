const db = require('../db');

async function addToCart(cartId, productId, quantity) {
    await db.query(`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id)
        DO UPDATE
        SET quantity = cart_items.quantity + EXCLUDED.quantity;`,
        [cartId, productId, quantity]
    );
}

async function removeFromCart(cartId, productId) {
    await db.query(`
        WITH updated AS (
            UPDATE cart_items
            SET quantity = quantity - 1
            WHERE cart_id = $1
            AND product_id = $2
            AND quantity > 1
            RETURNING *
        )
        DELETE FROM cart_items
        WHERE cart_id = $1 AND product_id = $2 AND NOT EXISTS (SELECT 1 FROM updated);`,
        [cartId, productId]
    );
}

async function getCartIdOrCreate(identity) {
    const { type, id } = identity;

    try {
        const column = type === 'user' ? 'user_id' : 'guest_id';

        const cartResult = await db.query(`
            WITH existing AS (
                SELECT id
                FROM carts
                WHERE ${column} = $1
                AND status = 'active'
            ),
            inserted AS (
                INSERT INTO carts (${column}, status)
                SELECT $1, 'active'
                WHERE NOT EXISTS (SELECT 1 FROM existing)
                ON CONFLICT DO NOTHING
                RETURNING id
            )
            SELECT id FROM inserted
            UNION ALL
            SELECT id FROM existing
            LIMIT 1;`,
            [id]
        );

        return cartResult.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getCartById(cartId) {
    try {
        const { rows } = await db.query(
            `
            SELECT
                ci.id AS cart_item_id,
                p.id AS product_id,
                p.name,
                p.description,
                p.price,
                p.images,
                ci.quantity,
                (p.price * ci.quantity) AS line_total
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1
            `,
            [cartId]
        );

        const totalResult = await db.query(`
            SELECT COALESCE(SUM(p.price * ci.quantity), 0) AS cart_total
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.cart_id = $1
        `, [cartId]);

        return {
            items: rows,
            total: totalResult.rows[0].cart_total
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    getCartIdOrCreate,
    getCartById
};