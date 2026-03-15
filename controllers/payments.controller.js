import rzp from "../utils/razorpay.instance.js";
import crypto from "crypto";
import { pool } from "../db.js";
import { emailNotes } from "../utils/sendNotes.js";

export const createOrder = async (req, res, next) => {
    const notes_id = req.body.notes_id;

    if (!notes_id) {
        return res.status(400).json({ message: 'notes_id is required.' });
    }

    const result = await pool.query(`select price from notes where id = $1`, [notes_id]);
    if (result.rows[0].length == 0) {
        return res.status(400).json({ message: 'No item with provided notes_id' })
    }

    const price = result.rows[0].price;
    const options = {
        amount: price * 100,
        currency: "INR",
    };

    try {
        const order = await rzp.orders.create(options);
        const result = await pool.query(`INSERT INTO purchased_notes (amount, user_id, notes_id, ispaymentverified, order_id) values ($1,$2,$3,$4,$5)`, [price, req.body.user_id, notes_id, false, order.id]);
        // console.log(result)
        res.status(200).json(order);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const verifyPayment = async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RZP_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        /* update database */
        const resp = await pool.query(`UPDATE purchased_notes SET ispaymentverified = $1 WHERE order_id = $2 RETURNING id`, [true, razorpay_order_id]);

        emailNotes(resp.rows[0].id);
        
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
}

