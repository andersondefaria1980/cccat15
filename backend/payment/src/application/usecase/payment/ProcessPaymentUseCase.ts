import Payment from "../../../domain/entity/Payment";
import PaymentOutput from "./PaymentOutput";

export default class ProcessPaymentUseCase {
    public constructor() {
    }

    public async execute(creditCardToken: string, amount: number): Promise<PaymentOutput> {
        const payment = await Payment.create(creditCardToken, amount, true, "Processed payment");
        return PaymentOutput.create(payment);
    }
}


