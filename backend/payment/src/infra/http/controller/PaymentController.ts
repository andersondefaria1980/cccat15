import PaymentOutput from "../../../application/usecase/payment/PaymentOutput";
import ProcessPaymentUseCase from "../../../application/usecase/payment/ProcessPaymentUseCase";

export default class PaymentController {
    public constructor() {
    }

    public async processPayment(params: any): Promise<PaymentOutput> {
        const processPaymentUseCase = new ProcessPaymentUseCase();
        const creditCardToken = params.creditCardToken;
        const amount = params.amount;
        return await processPaymentUseCase.execute(creditCardToken, amount);
    }
}
