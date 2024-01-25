import RideRepositoryInMemory from "../../../src/repository/ride/rideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import crypto from "crypto";
import AccountDTO from "../../../src/domain/accountDto";
import CoordinateDto from "../../../src/domain/coordinateDto";
import RideDto from "../../../src/domain/rideDto";
import AcceptRideUseCase from "../../../src/usecase/ride/acceptRideUseCase";
import RideValues from "../../../src/domain/rideValues";
import {AccountRepositoryInterface} from "../../../src/repository/account/accountRepositoryInterface";
import AccountDto from "../../../src/domain/accountDto";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let acceptRideUseCase: AcceptRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
})

test("Must update ride when driver accepts", async function () {
    const passengerAccountDto = await createAccount(accountRepository, true, false);
    const driverAccountDto = await createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const rideId = await createRide(passengerAccountDto);

    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await acceptRideUseCase.execute(rideId, driverAccountId);
    const rideAfterAccepted = await rideRepository.findRide(rideId);
    expect(rideAfterAccepted?.driver?.accountId).toBe(driverAccountId);
    expect(rideAfterAccepted?.status).toBe(RideValues.STATUS_ACCEPTED);
});

test("Must throw error when Ride does not exist", async function () {
    const driverAccountId = crypto.randomUUID();
    const rideId = crypto.randomUUID();
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error("Ride not found."));
});

test("Must throw error when Driver does not exist", async function () {
    const passengerAccountDto = await createAccount(accountRepository, true, false);
    const driverAccountId = crypto.randomUUID();
    const rideId = await createRide(passengerAccountDto);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error("Driver account not found."));
});

test("Must throw error when Driver is not a Driver", async function () {
    const passengerAccountDto = await createAccount(accountRepository, true, false);
    const passengerAccountId = passengerAccountDto.accountId ? passengerAccountDto.accountId : "";
    const rideId = await createRide(passengerAccountDto);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, passengerAccountId)).rejects.toThrow(new Error("Driver account is not set as a driver."));
});

test("Must throw error when Ride has status different then REQUESTED", async function () {
    const passengerAccountDto = await createAccount(accountRepository, true, false);
    const driverAccountDto = await createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const rideId = await createRide(passengerAccountDto, RideValues.STATUS_ACCEPTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error(`Ride has invalid status, ride stauts mus be ${RideValues.STATUS_REQUESTED}`));
});

async function createRide(passengerAccountDto: AccountDto, status: string = RideValues.STATUS_REQUESTED): Promise<string> {
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const rideId = crypto.randomUUID();
    const rideDto = new RideDto(rideId, passengerAccountDto, null, status, 0, 0, from, to, Date.now());
    await rideRepository.addRide(rideDto);
    return rideId;
}

async function createAccount(
    accountRepository: AccountRepositoryInterface,
    isPassenger: boolean,
    isDriver: boolean): Promise<AccountDto> {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", isPassenger, isDriver);
    await accountRepository.addAccount(accountDto);
    return accountDto;
}