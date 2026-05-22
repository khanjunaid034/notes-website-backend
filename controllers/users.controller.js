import timestamp from "unix-timestamp";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
// import { transporter } from "../sendEmail.js";
import sendEmail from "../utils/sendEmailSES.js";



const createOtp = () => {
    let otp = "";
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    if (otp.charAt(0) == '0') {
        otp = Number(otp) + 1000;
    }
    return otp;
}



const signJwtToken = (user) => {
    return jwt.sign(user, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES });
}



const verifyLogin = async (req, res, next) => {
    const data = req.body;
    if (!data?.otp || !data?.email) {
        return res.status(400).json({ message: 'Email and OTP are required' })
    }
    let myQuery = `SELECT * FROM users WHERE email=$1`;
    try {
        /* validate email */
        const result = await pool.query(myQuery, [data.email]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'User not found' });

        /* if user is found in DB, store it in a const called user */
        const user = result.rows[0];

        /* check if otp_expiry in DB is expired */
        if (timestamp.now() > user.otp_expiry)
            return res.status(400).json({ message: 'OTP expired' });

        /* if otp provided by the user doesnt match to the one sent via email */
        if (Number(data.otp) !== user.otp)
            return res.status(400).json({ message: 'Incorrect OTP' });

        /* remove otp and expiry from the user object before signing the jwt token */
        user.otp = undefined;
        user.otp_expiry = undefined;

        /* set account verified status as true */
        myQuery = `UPDATE users SET isAccountVerified = true WHERE id = $1`;
        await pool.query(myQuery, [user.id]);

        /* generate and send the jwt token */
        const token = signJwtToken(user);
        return res.status(200).json({ token })

    } catch (error) {
        res.status(400).json({ error });
    }
}




const loginUser = async (req, res, next) => {
    const data = req.body;
    if (!data?.email) {
        return res.status(400).json({ message: 'Email not supplied' });
    }
    let myQuery = `select * from users where email=$1`;
    try {
        let result = await pool.query(myQuery, [data.email]);

        let isUserExist = true;
        if (result.rows.length == 0)
            isUserExist = false;

        /* generate OTP and OTP expiry time */
        let expiry = timestamp.now();
        expiry = Math.round(timestamp.add(expiry, "+15m"));
        const otp = createOtp();

        /* this function creates the user */
        const createUser = async () => {
            myQuery = `INSERT INTO users  (email, otp, otp_expiry, isaccountverified, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            result = await pool.query(myQuery, [data.email, otp, expiry, false, 'customer']);
        }

        /* this function updates the otp and otp_expiry of existing user */
        const updateUser = async () => {
            myQuery = `UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3`;
            result = await pool.query(myQuery, [otp, expiry, data.email]);
        }

        isUserExist ? await updateUser() : await createUser();

        sendEmail({
            from: '"Computer Science Teacher" <no-reply@notes.awsdude.in>',
            email: data.email,
            subject: "Your login OTP for notes.awsdude.in",
            body: `OTP is ${otp}, valid for 15 minutes.`

        });

        return res.status(200).json({ message: "OTP sent via email, please check your SPAM folder too." });
    } catch (error) {
        // console.error(error);
        return res.status(400).json(error);
    }
}



const verifyJwt = async (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ status: false, message: 'JWT is required' });
    }

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
            // console.log(decoded);
        } catch (error) {
            return res.status(403).json({ status: false, message: "JWT malformed or expired" })
        }

        const result = await pool.query(`SELECT * from users WHERE id = $1`, [decoded.id]);
        if (result.rows.length === 0) return res.status(404).json({ status: false, message: "User not found" });

        req.user = result.rows[0];
        next();

    } catch (error) {
        res.status(500).json({ status: false, message: 'Something went wrong!' });
    }

}



const checkAdmin = (req, res, next) => {
    if (req.user.role != 'admin') {
        return res.status(403).json({ status: false, message: 'Only admins can perform this operation!' });
    }
    next();
}



const getUsers = async (req, res, next) => {
    try {
        const data = await pool.query(`select * from users`);
        console.log(data.rows);
        return res.status(200).json({ data: data.rows });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

export { loginUser, getUsers, verifyLogin, verifyJwt, checkAdmin };
