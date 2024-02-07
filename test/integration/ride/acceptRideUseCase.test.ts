import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import AcceptRideUseCase from "../../../src/application/usecase/ride/AcceptRideUseCase";
import RideTestUtils from "./RideTestUtils";
import Ride from "../../../src/domain/entity/Ride";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let acceptRideUseCase: AcceptRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
});

test("Must update ride when driver accepts", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccount.accountId ? driverAccount.accountId : "";
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId);

    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await acceptRideUseCase.execute(ride.rideId, driverAccountId);
    const rideAfterAccepted = await rideRepository.findRide(ride.rideId);
    expect(rideAfterAccepted?.getDriverId()).toBe(driverAccountId);
    expect(rideAfterAccepted?.getStatus()).toBe(Ride.STATUS_ACCEPTED);
});

test("Must throw error when Ride does not exist", async function () {
    const driverAccountId = crypto.randomUUID();
    const rideId = crypto.randomUUID();
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error("Ride not found."));
});

test("Must throw error when Driver does not exist", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, driverAccountId)).rejects.toThrow(new Error("Driver account not found."));
});

test("Must throw error when Driver is not a Driver", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const passengerAccountId = passengerAccount.accountId ? passengerAccount.accountId : "";
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, passengerAccountId)).rejects.toThrow(new Error("Driver account is not set as a driver."));
});

test("Must throw error when Ride has status different then REQUESTED", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await RideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccountDto.accountId ? driverAccountDto.accountId : "";
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_ACCEPTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, driverAccountId)).rejects.toThrow(new Error(`Ride has invalid status, ride stauts mus be ${Ride.STATUS_REQUESTED}`));
});

test("Must throw error when Driver has another ride accepted or in progress", async function () {
    const passengerAccountFirstRide = await RideTestUtils.createAccount(accountRepository, true, false);
    await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const driverAccountId = driverAccount.accountId ? driverAccount.accountId : "";
    await RideTestUtils.createRide(rideRepository, passengerAccountFirstRide.accountId, Ride.STATUS_IN_PROGRESS, driverAccountId);
    const rideSecondRide = await RideTestUtils.createRide(rideRepository, passengerAccountFirstRide.accountId, Ride.STATUS_REQUESTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountRepository);
    await expect ( () => acceptRideUseCase.execute(rideSecondRide.rideId, driverAccountId)).rejects.toThrow(new Error(`Driver has another ride accepted or in progress.`));
});
