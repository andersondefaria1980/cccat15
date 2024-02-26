import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";
import TransactionOutput from "./inputOutputData/TransactionOutput";

export default class ListTransactionUseCase {
    constructor(readonly rideRepository: RideRepositoryInterface) {
    }

    async execute(rideId: string): Promise<TransactionOutput[]> {
        const transactionList = await this.rideRepository.listRideTransactions(rideId);
        let list: TransactionOutput[] = [];
        transactionList.forEach((t) => {
           list.push(TransactionOutput.create(t));
        });
        return list;
    }
}
