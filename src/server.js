const express = require('express');
const app = express();

app.use('/', require('./route/accountRoute'));

app.listen(3000, () => {
    console.log('[server]: Server is runint at http://localhost:3000');
});