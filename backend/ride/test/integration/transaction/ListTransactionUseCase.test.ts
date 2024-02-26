import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import ListTransactionUseCase from "../../../src/application/usecase/transaction/ListTransactionUseCase";
import TransactionOutput from "../../../src/application/usecase/transaction/inputOutputData/TransactionOutput";
import Transaction from "../../../src/domain/entity/Transaction";

let rideRepository: RideRepositoryInMemory;
let listTransactionUseCase: ListTransactionUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
});

test("Must return a list of transactions from a ride", async function() {
    const rideId = '123';
    const transaction = await Transaction.create(rideId, 125.69, true);
    await rideRepository.addTransaction(transaction);
    listTransactionUseCase = new ListTransactionUseCase(rideRepository);
    const transactionList = await listTransactionUseCase.execute(rideId);
    expect(Array.isArray(transactionList)).toBe(true);
    expect(transactionList.length).toBe(1);
    transactionList.forEach((transactionOutput) => {
        expect(transactionOutput).toBeInstanceOf(TransactionOutput);
    })    
});
