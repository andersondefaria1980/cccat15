import express from 'express';
import AccountController from "./controller/AccountController";

const router = express.Router();
const accountController = new AccountController();

router.get('/accounts/:id', async function (req, res, ) {
    try {
        const account = await accountController.getAccount(req.params);
        res.status(200).json(account);
    } catch (e) {
        const code = e == "Error: Account not found" ? 404 : 422;
        res.status(code).json({
            msg: `${e}`
        });
    }
});

router.post('/signup', async function (req, res, ) {
    try {
        const accountId = await accountController.signup(req.body);
        res.status(201).json({
            "msg": "Account created",
            "accountId": accountId,
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

export default router;