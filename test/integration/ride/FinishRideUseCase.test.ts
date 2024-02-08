import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";
import FinishRideUseCase from "../../../src/application/usecase/ride/FinishRideUseCase";
import PositionRepositoryInMemory from "../../../src/repository/position/PositionRepositoryInMemory";

let rideRepository: RideRepositoryInMemory;
let positionRepository: PositionRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let finishRideUseCase: FinishRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    positionRepository = new PositionRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
});

test("Should throw error if ride is not found", async function() {
    const rideId = crypto.randomUUID();
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository);
    await expect(() => finishRideUseCase.execute(rideId)).rejects.toThrow(new Error(`Ride not found`));
});

test("Should throw error if ride is not found", async function() {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId);
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository);
    await expect(() => finishRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Invalid ride status. Ride only can be finished if status = ${Ride.STATUS_IN_PROGRESS}`));
});

test("Musf finish ride and calculate distance and fare", async function() {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const driverAccount = await RideTestUtils.createAccount(accountRepository, false, true);
    const fromLat = -27.588272014187325;
    const fromLong = -48.61394608749286;
    const toLat = -27.597054794241224;
    const toLong = -48.5753934252425;
    const p1Lat = -27.59167834124668;
    const p1Long = -48.60594819997932;
    const p2Lat = -27.60216325106579;
    const p2Long = -48.596169316967064;
    const p3Lat = -27.60197198140215;
    const p3Long = -48.57916857150611;
    const p4Lat = -27.60197198140215;
    const p4Long = -48.57916857150611;
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId, Ride.STATUS_IN_PROGRESS, driverAccount.accountId, fromLat, fromLong, toLat, toLong, fromLat, fromLong);
    await RideTestUtils.addPosition(positionRepository, ride.rideId, p1Lat, p1Long);
    await RideTestUtils.addPosition(positionRepository, ride.rideId, p2Lat, p2Long);
    await RideTestUtils.addPosition(positionRepository, ride.rideId, p3Lat, p3Long);
    await RideTestUtils.addPosition(positionRepository, ride.rideId, p4Lat, p4Long);
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository);
    await finishRideUseCase.execute(ride.rideId);
    const finishedRide = await rideRepository.findRide(ride.rideId);
    expect(finishedRide?.getStatus()).toBe(Ride.STATUS_COMPLETED);
    expect(finishedRide?.getDistance()).toBe(3.19);
    expect(finishedRide?.getFare()).toBe(6.7);
});
