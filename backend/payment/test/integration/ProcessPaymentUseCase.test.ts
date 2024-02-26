import ProcessPaymentUseCase from "../../src/application/usecase/payment/ProcessPaymentUseCase";
import crypto from "crypto";
import Payment from "../../src/domain/entity/Payment";

let processPaymentUseCase: ProcessPaymentUseCase;

beforeEach(() => {
    processPaymentUseCase = new ProcessPaymentUseCase();
});

test("Must process Payment", async function () {
    const creditCardToken = crypto.randomUUID();
    const amount = 125.69;
    const responsePayment = await processPaymentUseCase.execute(creditCardToken, amount);
    expect(responsePayment.creditCardToken).toBe(creditCardToken);
    expect(responsePayment.amount).toBe(amount);
    expect(responsePayment.success).toBeTruthy();
    expect(responsePayment.description).toBe("Processed payment")
});
