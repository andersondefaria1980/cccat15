import {PaymentGateway} from "../../../src/infra/gateway/PaymentGateway";
import crypto from "crypto";

describe("Process Payment", () => {
    it("Should process payment", async () => {
        const paymentGateway = new PaymentGateway();
        const rideId = crypto.randomUUID();
        const creditCardToken = crypto.randomUUID();
        const amount = 125.69;
        const paymentOutput = await paymentGateway.processPayment(rideId, creditCardToken, amount);
        expect(paymentOutput.paymentId).toBeDefined();
        expect(paymentOutput.creditCardToken).toBe(creditCardToken);
        expect(paymentOutput.amount).toBe(amount);
        expect(paymentOutput.success).toBeTruthy();
        expect(paymentOutput.description).toBe('Processed payment');
    });
});