import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RequestRideUseCase from "../../../src/usecase/ride/RequestRideUseCase";
import Account from "../../../src/domain/Account";
import RideInput from "../../../src/usecase/ride/inputOutputData/RideInput";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let requestRideUseCase: RequestRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountRepository);
})

test("Must request a ride", async function() {
    const accountPassenger = Account.create("Jose da Silva", "jose@tests.com", "04780028078", true, false);
    await accountRepository.addAccount(accountPassenger);
    const rideInput = RideInput.create(accountPassenger.accountId, 1,2,5,6);
    const rideId = await requestRideUseCase.execute(rideInput);
    expect(typeof(rideId)).toBe("string");
});

test("Must return error if account not found", async function () {
    const accountId = 'AAA';
    const rideInput = RideInput.create(accountId, 1,2,5,6);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Account not found."))
});

test("Must return error if account is not passenger", async function () {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", false, true);
    await accountRepository.addAccount(account);
    const rideInput = RideInput.create(account.accountId, 1,2,5,6);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger account is not passenger."))
});

test("Must return error if passenger has any ride not completed", async function () {
    const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", true, false);
    await accountRepository.addAccount(account);
    const rideInput = RideInput.create(account.accountId, 1,2,5,6);
    await requestRideUseCase.execute(rideInput);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger has ride not completed."));
});
