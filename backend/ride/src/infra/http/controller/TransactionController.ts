import RideRepositoryDatabase from "../../repository/ride/RideRepositoryDatabase";
import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import TransactionOutput from "../../../application/usecase/transaction/inputOutputData/TransactionOutput";
import ListTransactionUseCase from "../../../application/usecase/transaction/ListTransactionUseCase";


export default class TransactionController {
    private rideRepository: RideRepositoryInterface;

    public constructor() {
        this.rideRepository = new RideRepositoryDatabase();
    }

    public async listTransactions(params: any): Promise<TransactionOutput[]> {
        const listTransactions = new ListTransactionUseCase(this.rideRepository);
        return await listTransactions.execute(params.rideId);
    }
}
