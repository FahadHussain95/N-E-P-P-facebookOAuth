//file to connect to Postgres server
const { Pool } = require("pg");

const pool = new Pool({
    user: 'your-database-username-for-postgres',
    host: 'localhost',
    database: 'your-database-name',
    password: 'your-database-password',
    port: 5432,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0
});
module.exports = {pool};