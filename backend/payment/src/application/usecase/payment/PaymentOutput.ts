import Payment from "../../../domain/entity/Payment";

export default class PaymentOutput {
    private constructor(
        readonly paymentId: string,
        readonly creditCardToken: string,
        readonly amount: number,
        readonly success: boolean,
        readonly description: string,
    ){};

    public static create(payment: Payment) {
        return new PaymentOutput(payment.paymentId, payment.creditCardToken, payment.amount, payment.success, payment.description);
    }
}
