const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using the connection string from Railway
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Railway and many cloud databases
    }
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database via Railway');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
