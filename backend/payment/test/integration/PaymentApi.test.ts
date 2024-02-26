import axios from "axios";
import crypto from 'crypto';
import Payment from "../../src/domain/entity/Payment";

axios.defaults.validateStatus = function () {
    return true;
}

const baseURL = "http://localhost:3002";

describe("POST /payment/process", () => {
    it("Should process payment", async () => {
        const creditCardToken = crypto.randomUUID();
        const amount = 258.99;
        const response = await axios.post(`${baseURL}/payment/process`, {creditCardToken: creditCardToken, amount: amount});
        expect(response.data.paymentId).toBeDefined();
        expect(response.data.creditCardToken).toBe(creditCardToken);
        expect(response.data.amount).toBe(amount);
        expect(response.data.success).toBeTruthy();
    });
});
