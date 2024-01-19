const pg = require('pg-promise');
const db = pgp({
    user: 'postgres',
    password: 'secret',
    host: 'localhost',
    port: 25432,
    database: 'ccca15'
});
module.exports = db;