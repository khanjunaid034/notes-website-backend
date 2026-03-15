import dotenv from "dotenv";
dotenv.config({ quiet: true });

import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

let client;

try {
    client = await pool.connect();
    console.log('DB connection OK');
    client.release();
} catch (error) {
    console.log(error);
}

export { pool };