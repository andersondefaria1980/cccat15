import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import ListRidesUseCase from "../../../src/application/usecase/ride/ListRidesUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/application/usecase/ride/inputOutputData/RideOutput";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let listRideUseCase: ListRidesUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    listRideUseCase = new ListRidesUseCase(rideRepository, accountRepository);
});

test("Must return a list of rides", async function() {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    await RideTestUtils.createRide(rideRepository, passengerAccount.accountId);
    const rideList = await listRideUseCase.execute();
    expect(Array.isArray(rideList)).toBe(true);
    rideList.forEach((rideOutput) => {
        expect(rideOutput).toBeInstanceOf(RideOutput);
    })    
});
