import { pool } from "../db.js";

const getProjects = async (req, res, next) => {
    try {
        const result = await pool.query(`SELECT * FROM project_data ORDER BY created_at DESC`);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json(error);
    }
}

const createProject = async (req, res, next) => {
    try {
        const data = req.body;
        const myQuery = `INSERT INTO project_data (title, cover_location, tech_stack) VALUES($1, $2, $3) RETURNING *`;
        const { rows } = await pool.query(myQuery, [data.title, data.cover_location, data.tech_stack]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}

export { getProjects, createProject };