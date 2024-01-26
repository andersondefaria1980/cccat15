import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import AcceptRideUseCase from "../../../src/usecase/ride/AcceptRideUseCase";
import RideValues from "../../../src/domain/RideValues";
import RideTestUtils from "./rideTestUtils";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let acceptRideUseCase: AcceptRideUseCase;
let rideTestUtils: RideTestUtils;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Must update ride when driver accepts", async function () {
    const passengerAccountDto = await rideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await rideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const rideId = await rideTestUtils.createRide(rideRepository, passengerAccountDto);

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
    const passengerAccountDto = await rideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountId = crypto.randomUUID();
    const rideId = await rideTestUtils.createRide(rideRepository,passengerAccountDto);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error("Driver account not found."));
});

test("Must throw error when Driver is not a Driver", async function () {
    const passengerAccountDto = await rideTestUtils.createAccount(accountRepository, true, false);
    const passengerAccountId = passengerAccountDto.accountId ? passengerAccountDto.accountId : "";
    const rideId = await rideTestUtils.createRide(rideRepository, passengerAccountDto);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, passengerAccountId)).rejects.toThrow(new Error("Driver account is not set as a driver."));
});

test("Must throw error when Ride has status different then REQUESTED", async function () {
    const passengerAccountDto = await rideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await rideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const rideId = await rideTestUtils.createRide(rideRepository, passengerAccountDto, RideValues.STATUS_ACCEPTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error(`Ride has invalid status, ride stauts mus be ${RideValues.STATUS_REQUESTED}`));
});

test("Must throw error when Driver has another ride accepted or in progress", async function () {
    const passengerAccountDtoFirstRide = await rideTestUtils.createAccount(accountRepository, true, false);
    const passengerAccountDtoSecondRide = await rideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await rideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const rideIdFirstRide = await rideTestUtils.createRide(rideRepository, passengerAccountDtoFirstRide, RideValues.STATUS_IN_PROGRESS, driverAccountDto);
    const rideIdSecondRide = await rideTestUtils.createRide(rideRepository, passengerAccountDtoFirstRide, RideValues.STATUS_REQUESTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideIdSecondRide, driverAccountId)).rejects.toThrow(new Error(`Driver has another ride accepted or in progress.`));
});
