import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import crypto from "crypto";
import AcceptRideUseCase from "../../../src/application/usecase/ride/AcceptRideUseCase";
import RideTestUtils from "./RideTestUtils";
import Ride from "../../../src/domain/entity/Ride";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";

let rideRepository: RideRepositoryInMemory;
let accountGateway: AccountGateway;
let acceptRideUseCase: AcceptRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountGateway = new AccountGateway();
});

test("Must update ride when driver accepts", async function () {
    const passengerAccountId = await RideTestUtils.createAccount(true, false);
    const driverAccountId = await RideTestUtils.createAccount(false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await acceptRideUseCase.execute(ride.rideId, driverAccountId);
    const rideAfterAccepted = await rideRepository.findRide(ride.rideId);
    expect(rideAfterAccepted?.getDriverId()).toBe(driverAccountId);
    expect(rideAfterAccepted?.getStatus()).toBe(Ride.STATUS_ACCEPTED);
});

test("Must throw error when Ride does not exist", async function () {
    const driverAccountId = crypto.randomUUID();
    const rideId = crypto.randomUUID();
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await expect ( () => acceptRideUseCase.execute(rideId, driverAccountId)).rejects.toThrow(new Error("Ride not found"));
});

test("Must throw error when Driver does not exist", async function () {
    const passengerAccountId = await RideTestUtils.createAccount(true, false);
    const driverAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, driverAccountId)).rejects.toThrow(new Error("Driver account not found."));
});

test("Must throw error when Driver is not a Driver", async function () {
    const passengerAccountId = await RideTestUtils.createAccount(true, false);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, passengerAccountId)).rejects.toThrow(new Error("Driver account is not set as a driver."));
});

test("Must throw error when Ride has status different then REQUESTED", async function () {
    const passengerAccountId = await RideTestUtils.createAccount(true, false);
    const driverAccountId = await RideTestUtils.createAccount(false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_ACCEPTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await expect ( () => acceptRideUseCase.execute(ride.rideId, driverAccountId)).rejects.toThrow(new Error(`Ride has invalid status, ride stauts mus be ${Ride.STATUS_REQUESTED}`));
});

test("Must throw error when Driver has another ride accepted or in progress", async function () {
    const passengerAccountIdFirstRide = await RideTestUtils.createAccount(true, false);
    await RideTestUtils.createAccount(true, false);
    const driverAccountId = await RideTestUtils.createAccount(false, true);
    await RideTestUtils.createRide(rideRepository, passengerAccountIdFirstRide, Ride.STATUS_IN_PROGRESS, driverAccountId);
    const rideSecondRide = await RideTestUtils.createRide(rideRepository, passengerAccountIdFirstRide, Ride.STATUS_REQUESTED);
    acceptRideUseCase = new AcceptRideUseCase(rideRepository, accountGateway);
    await expect ( () => acceptRideUseCase.execute(rideSecondRide.rideId, driverAccountId)).rejects.toThrow(new Error(`Driver has another ride accepted or in progress.`));
});
