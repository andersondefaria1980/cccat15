import Ride from "../../../../domain/entity/Ride";
import Transaction from "../../../../domain/entity/Transaction";

export default class TransactionOutput {
    private constructor(
        readonly transactionId: string,
        readonly rideId: string,
        readonly amount: number,
        readonly date: Date,
        readonly status: string,
    ){};

    public static create(transaction: Transaction) {
        return new TransactionOutput(
            transaction.transactionId,
            transaction.rideId,
            transaction.amount,
            transaction.dateTime,
            transaction.status,
        );
    }
}
