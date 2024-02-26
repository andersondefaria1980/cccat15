import crypto from "crypto";

export default class Transaction {
    public static STATUS_PROCESSED = "PROCESSED";
    public static STATUS_ERROR = "ERROR";

    constructor(
        readonly transactionId: string,
        readonly rideId: string,
        readonly amount: number,
        readonly dateTime: Date,
        readonly status: string,
    ) {
    }

    public static async create(rideId: string, amount: number, success: boolean) {
        const transactionId = crypto.randomUUID();
        const dateTime = new Date();
        const status = success ? this.STATUS_PROCESSED : this.STATUS_ERROR;
        return new Transaction(transactionId, rideId, amount, dateTime, status);
    }

    public static restore(transactionId: string, rideId: string, amount: number, dateTime: Date, status: string) {
        return new Transaction(transactionId, rideId, +amount, dateTime, status);
    }
}
