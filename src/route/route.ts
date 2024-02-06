import express from 'express';
import AccountController from "../controller/AccountController";
import RideController from "../controller/RideController";

const router = express.Router();
const accountController = new AccountController();
const rideController = new RideController();

router.get('/rides', async function (req, res, ) {
    try {
        const rides = await rideController.listRides(req.params);
        res.status(200).json(rides);
    } catch (e) {
        res.status(422).json({
            msg: `${e}`,
        });
    }
});

router.get('/rides/:id', async function (req, res, ) {
    try {
        const ride = await rideController.getRide(req.params);
        res.status(200).json(ride);
    } catch (e) {
        const code = e == "Error: Ride not found" ? 404 : 422;
        res.status(code).json({
            msg: `${e}`
        });
    }
});

router.post('/rides/request', async function (req, res, ) {
    try {
        const rideId = await rideController.requestRide(req.body);
        res.status(201).json({
            "msg": "Ride requested",
            "rideId": rideId,
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.delete('/rides/:id', async function (req, res, ) {
    try {
        await rideController.deleteRide(req.params);
        res.status(200).json({
            "msg": "Ride deleted",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.post('/rides/accept', async function (req, res, ) {
    try {
        await rideController.acceptRide(req.body);
        res.status(200).json({
            "msg": "Ride accepted",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.post('/rides/start', async function (req, res, ) {
    try {
        await rideController.startRide(req.body);
        res.status(200).json({
            "msg": "Ride started",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.get('/accounts', async function (req, res, ) {
    try {
        const accounts = await accountController.listAccounts(req.params, req.body);
        res.status(200).json(accounts);
    } catch (e) {
        res.status(422).json({
            msg: `Erro:  ${e}`
        });
    }
});

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

router.post('/accounts', async function (req, res, ) {
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

router.put('/accounts', async function (req, res, ) {
    try {
        await accountController.updateAccount(req.body);
        res.status(200).json({
            "msg": "Account updated",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.delete('/accounts/:id', async function (req, res, ) {
    try {
        await accountController.deleteAccount(req.params);
        res.status(200).json({
            "msg": "Account deleted",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

export default router;