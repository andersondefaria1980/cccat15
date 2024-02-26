import crypto from "crypto";

export default class Payment {
    public static STATUS_PROCESSED= "PROCESSED";
    public static STATUS_ERROR = "ERROR";

    constructor(
        readonly paymentId: string,
        readonly creditCardToken: string,
        readonly amount: number,
        readonly success: boolean,
        readonly description: string,
    ) {
    }

    public static async create(creditCardToken: string, amount: number, success: boolean, description: string) {
        const paymentId = crypto.randomUUID();
        return new Payment(paymentId, creditCardToken, amount, success, description);
    }
}
