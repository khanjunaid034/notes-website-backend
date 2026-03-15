import { pool } from "../db.js";


export const addNotes = async (req, res, next) => {
    const data = req.body;
    if (!req?.files?.notesPdf[0]?.location) {
        return res.status(400).json({ status: false, message: "File upload was failed, cannot proceed" });
    }

    if (!data?.title || !data?.price || !data?.subject)
        return res.status(400).json({ status: false, message: "Required fields are missing!" })

    try {
        const myQuery = `INSERT INTO notes (title, subject, price, url) VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await pool.query(myQuery, [data.title, data.subject, data.price, req.files.notesPdf[0].location]);
        return res.status(201).json({ status: true, message: 'Done' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error?.message || 'Something went wrong!' });
    }
}


export const getNotes = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM notes`);
        return res.status(200).json({ status: true, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status: false, message: error?.message || 'Something went wrong!' });
    }
}