import express from 'express';
import AccountController from "../controller/AccountController";
import RideController from "../controller/RideController";

const router = express.Router();
const accountController = new AccountController();
const rideController = new RideController();

router.get('/rides', async function (req, res, ) {
    await rideController.listRides(req, res);
});

router.get('/rides/:id', async function (req, res, ) {
    await rideController.getRide(req, res);
});

router.post('/rides/request', async function (req, res, ) {
    await rideController.requestRide(req, res);
});

router.delete('/rides/:id', async function (req, res, ) {
    await rideController.deleteRide(req, res);
});

router.post('/rides/accept', async function (req, res, ) {
    await rideController.acceptRide(req, res);
});

router.post('/rides/start', async function (req, res, ) {
    await rideController.startRide(req, res);
});

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