import pg from 'pg';
const { Pool } = pg;

// Postgres DB setup
const pool = new Pool({
    user: process.env.HOSTCODE_DB_USER,
    host: process.env.HOSTCODE_DB_HOST,
    database: process.env.HOSTCODE_DB_DATABASE,
    password: process.env.HOSTCODE_DB_PASSWORD,
    port: process.env.HOSTCODE_DB_PORT,
});

export default { query: (text, params) => pool.query(text, params) };
