import express from 'express';
import accountController from '../controller/accountController';

const router = express.Router();

router.get('/accounts', accountController.getAccounts);

router.get('/accounts/:id', accountController.getAccount);

router.post('/accounts', accountController.addAccount);

router.put('accounts/:id', async function (req, resp) {

});

router.delete('accounts/:id', async function (req, resp) {

});

export default router;