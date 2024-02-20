import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";
import UpdateRidePositionUseCase from "../../../src/application/usecase/ride/UpdateRidePositionUseCase";
import PositionRepositoryInMemory from "../../../src/infra/repository/position/PositionRepositoryInMemory";
import RidePositionInput from "../../../src/application/usecase/ride/inputOutputData/RidePositionInput";

let rideRepository: RideRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let updateRidePosition: UpdateRidePositionUseCase;
let positionRepository: PositionRepositoryInMemory

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    positionRepository = new PositionRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Must update ride position", async function() {
    const passengerAccountId = await RideTestUtils.createAccount( true, false);
    const driverAccountId = await RideTestUtils.createAccount( false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_IN_PROGRESS, driverAccountId, -27.584905257808835, -48.545022195325124, -27.496887588317275, -48.522234807851476);
    updateRidePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    const newLat = -27.496887588317275;
    const newLong = -48.522234807851476;
    const newPosition = new RidePositionInput(ride.rideId, newLat, newLong);
    await updateRidePosition.execute(newPosition);
    const rideAfterPositionUpdated = await rideRepository.findRide(ride.rideId);
    expect(rideAfterPositionUpdated?.getLastLat()).toBe(newLat);
    expect(rideAfterPositionUpdated?.getLastLong()).toBe(newLong);
    expect(rideAfterPositionUpdated?.getDistance()).toBe(10.04);
});

test("Must throw error if ride does not exist", async function () {
    const rideId = crypto.randomUUID();
    updateRidePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    const newLat = -27.496887588317275;
    const newLong = -48.522234807851476;
    const newPosition = new RidePositionInput(rideId, newLat, newLong);
    await expect(() => updateRidePosition.execute(newPosition)).rejects.toThrow(new Error("Ride not found"));
});

test("Must throw error if ride does not have status equals to: IN_PROGRESS", async function () {
    const passengerAccountId = await RideTestUtils.createAccount( true, false);
    const driverAccountId = await RideTestUtils.createAccount( false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_ACCEPTED, driverAccountId);
    updateRidePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    const newLat = -27.496887588317275;
    const newLong = -48.522234807851476;
    const newPosition = new RidePositionInput(ride.rideId, newLat, newLong);
    await expect(() => updateRidePosition.execute(newPosition)).rejects.toThrow(new Error(`Invalid ride status. Position only can be update if status = ${Ride.STATUS_IN_PROGRESS}`));
});
