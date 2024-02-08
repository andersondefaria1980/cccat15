import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import StartRideUseCase from "../../../src/application/usecase/ride/StartRideUseCase";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";
import UpdateRidePositionUseCase from "../../../src/application/usecase/ride/UpdateRidePositionUseCase";
import PositionRepositoryInMemory from "../../../src/repository/position/RideRepositoryInMemory";
import RidePositionInput from "../../../src/application/usecase/ride/inputOutputData/RidePositionInput";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let startRideUseCase: StartRideUseCase;
let updateRidePosition: UpdateRidePositionUseCase;
let positionRepository: PositionRepositoryInMemory

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

//parado aqui
test.only("Must update ride position", async function() {
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
    expect(rideAfterPositionUpdated?.getDistance()).toBe(10);
});

test("Must throw error if ride does not exist", async function () {
    const passengerAccountDto = await RideTestUtils.createAccount(accountRepository, true, false);
    const rideId = crypto.randomUUID();
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(rideId)).rejects.toThrow(new Error("Ride not found."));
});

test("Must throw error if ride does not have driver", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_ACCEPTED);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error("Ride does not have a driver and cannot be started."));
});

test("Must throw error if ride does not have status equals to: ACCEPTED", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_IN_PROGRESS, driverAccount.accountId);
    startRideUseCase = new StartRideUseCase(rideRepository);
    await expect(() => startRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Ride can be started only if status = ${Ride.STATUS_ACCEPTED}. Ride status is ${Ride.STATUS_IN_PROGRESS}`));
});
