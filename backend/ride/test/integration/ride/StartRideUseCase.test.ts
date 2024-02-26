import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import StartRideUseCase from "../../../src/application/usecase/ride/StartRideUseCase";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";

let rideRepository: RideRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let startRideUseCase: StartRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Must start a ride", async function() {
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_ACCEPTED, driverAccountId);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await startRideUseCase.execute(ride.rideId);
    const rideAfterStarted = await rideRepository.findRide(ride.rideId);
    expect(rideAfterStarted?.getStatus()).toBe(Ride.STATUS_IN_PROGRESS);
});

test("Must throw error if ride does not exist", async function () {
    const rideId = crypto.randomUUID();
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(rideId)).rejects.toThrow(new Error("Ride not found"));
});

test("Must throw error if ride does not have driver", async function () {
    const passengerAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_ACCEPTED);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error("Ride does not have a driver and cannot be started."));
});

test("Must throw error if ride does not have status equals to: ACCEPTED", async function () {
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_IN_PROGRESS, driverAccountId);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Ride can be started only if status = ${Ride.STATUS_ACCEPTED}. Ride status is ${Ride.STATUS_IN_PROGRESS}`));
});
