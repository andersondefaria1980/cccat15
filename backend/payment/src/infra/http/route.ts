import express from 'express';
import PaymentController from "./controller/PaymentController";

const router = express.Router();
const paymentController = new PaymentController();

router.post('/payment/process', async function (req, res, ) {
    try {
        const paymentOutput = await paymentController.processPayment(req.body);
        res.status(200).json(paymentOutput);
    } catch (e) {
        res.status(422).json({
            msg: `${e}`,
        });
    }
});

export default router;
