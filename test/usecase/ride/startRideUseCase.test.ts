import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import StartRideUseCase from "../../../src/usecase/ride/StartRideUseCase";
import crypto from "crypto";
import Ride from "../../../src/domain/Ride";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let startRideUseCase: StartRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Must start a ride", async function() {
    const passengerAccountDto = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await RideTestUtils.createAccount(accountRepository, false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountDto, Ride.STATUS_ACCEPTED, driverAccountDto);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await startRideUseCase.execute(ride.rideId);
    const rideAfterStarted = await rideRepository.findRide(ride.rideId);
    expect(rideAfterStarted?.status).toBe(Ride.STATUS_IN_PROGRESS);
});

test("Must throw error if ride does not exist", async function () {
    const passengerAccountDto = await RideTestUtils.createAccount(accountRepository, true, false);
    const rideId = crypto.randomUUID();
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(rideId)).rejects.toThrow(new Error("Ride not found."));
});

test("Must throw error if ride does not have driver", async function () {
    const passengerAccountDto = await RideTestUtils.createAccount(accountRepository, true, false);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountDto, Ride.STATUS_ACCEPTED);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error("Ride does not have a driver and cannot be started."));
});

test("Must throw error if ride does not have status equals to: ACCEPTED", async function () {
    const passengerAccountDto = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccountDto = await RideTestUtils.createAccount(accountRepository, false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountDto, Ride.STATUS_IN_PROGRESS, driverAccountDto);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Ride can be started only if status = ${Ride.STATUS_ACCEPTED}. Ride status is ${Ride.STATUS_IN_PROGRESS}`));
});
