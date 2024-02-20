import express from 'express';
import RideController from "./controller/RideController";

const router = express.Router();
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

router.post('/rides/update-position', async function (req, res, ) {
    try {
        await rideController.updatePosition(req.body);
        res.status(200).json({
            "msg": "Position Updated",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

router.post('/rides/finish', async function (req, res, ) {
    try {
        await rideController.finishRide(req.body);
        res.status(200).json({
            "msg": "Ride Finished",
        });
    } catch (e) {
        res.status(422).json({
            msg: `${e}`
        });
    }
});

export default router;