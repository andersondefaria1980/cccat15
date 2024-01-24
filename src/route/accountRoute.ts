import express from 'express';
import AccountController from "../controller/accountController";

const router = express.Router();
const accountController = new AccountController();

router.get('/accounts', async function (req, res, ) {
    await accountController.getAccounts(req, res);
});

router.get('/accounts/:id', async function (req, res, ) {
    await accountController.getAccount(req, res);
});

router.post('/accounts', async function (req, res, ) {
    await accountController.addAccount(req, res);
});

router.put('/accounts', async function (req, res, ) {
    await accountController.updateAccount(req, res);
});

router.delete('/accounts/:id', async function (req, res, ) {
    await accountController.deleteAccount(req, res);
});

export default router;