import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import StartRideUseCase from "../../../src/application/usecase/ride/StartRideUseCase";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";
import UpdateRidePositionUseCase from "../../../src/application/usecase/ride/UpdateRidePositionUseCase";
import PositionRepositoryInMemory from "../../../src/repository/position/PositionRepositoryInMemory";
import RidePositionInput from "../../../src/application/usecase/ride/inputOutputData/RidePositionInput";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let updateRidePosition: UpdateRidePositionUseCase;
let positionRepository: PositionRepositoryInMemory

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    positionRepository = new PositionRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Must update ride position", async function() {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_IN_PROGRESS, driverAccount.accountId, -27.584905257808835, -48.545022195325124, -27.496887588317275, -48.522234807851476);
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
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_ACCEPTED, driverAccount.accountId);
    updateRidePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    const newLat = -27.496887588317275;
    const newLong = -48.522234807851476;
    const newPosition = new RidePositionInput(ride.rideId, newLat, newLong);
    await expect(() => updateRidePosition.execute(newPosition)).rejects.toThrow(new Error(`Invalid ride status. Position only can be update if status = ${Ride.STATUS_IN_PROGRESS}`));
});
