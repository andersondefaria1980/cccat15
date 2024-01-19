const express = require('express');
const router = express.Router();

router.get('/accounts', async function (req, resp) {

    resp.json([{
        "id": 699999,          
        "email": "sadfasdfasdfasaaaaaaaaaaabbbbbbbbbbbbbbaaaa"
    }]);
});

router.get('/accounts/:id', async function (req, resp) {
    
});

router.post('/accounts', async function (req, resp) {

});

router.put('accounts/:id', async function (req, resp) {

});

router.delete('accounts/:id', async function (req, resp) {

});

module.exports = router;