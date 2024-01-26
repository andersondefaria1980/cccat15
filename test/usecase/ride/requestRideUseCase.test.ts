import RideDtoRequest from "../../../src/domain/RideDtoRequest";
import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import AccountDTO from "../../../src/domain/AccountDto";
import crypto from "crypto";
import CoordinateDto from "../../../src/domain/CoordinateDto";
import RequestRideUseCase from "../../../src/usecase/ride/RequestRideUseCase";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let requestRideUseCase: RequestRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountRepository);
})

test("Must request a ride", async function() {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const requestRideDto = new RideDtoRequest(accountId, from, to);
    const rideId = await requestRideUseCase.execute(requestRideDto);
    expect(typeof(rideId)).toBe("string");
});

test("Must return error if account not found", async function () {
    const accountId = crypto.randomUUID();
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const requestRideDto = new RideDtoRequest(accountId, from, to);
    await expect(() => requestRideUseCase.execute(requestRideDto)).rejects.toThrow(new Error("Account not found."))
});

test("Must return error if account is not passenger", async function () {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const requestRideDto = new RideDtoRequest(accountId, from, to);
    await expect(() => requestRideUseCase.execute(requestRideDto)).rejects.toThrow(new Error("Account is not passenger."))
});

test("Must return error if passenger has any ride not completed", async function () {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const requestRideDto = new RideDtoRequest(accountId, from, to);
    await requestRideUseCase.execute(requestRideDto);
    await expect(() => requestRideUseCase.execute(requestRideDto)).rejects.toThrow(new Error("Passenger has ride not completed."));
});
