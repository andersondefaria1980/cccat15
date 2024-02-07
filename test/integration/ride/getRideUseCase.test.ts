import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import AccountDTO from "../../../src/application/usecase/account/inputOutputData/AccountInput";
import Coordinate from "../../../src/application/usecase/ride/inputOutputData/Coordinate";
import Ride from "../../../src/domain/entity/Ride";
import GetRideUseCase from "../../../src/application/usecase/ride/GetRideUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/application/usecase/ride/inputOutputData/RideOutput";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let getRideUseCase: GetRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    getRideUseCase = new GetRideUseCase(rideRepository);
})

test("Must return a ride", async function () {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const from = Coordinate.create(1,2);
    const to = Coordinate.create(5,6);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount.accountId);
    const rideOutput = await getRideUseCase.execute(ride.rideId);
    expect(rideOutput).toBeInstanceOf(RideOutput);
    expect(typeof rideOutput?.fare).toBe("number");
    expect(typeof rideOutput?.distance).toBe("number");
    expect(typeof rideOutput?.date).toBe("number");
    expect(rideOutput?.from).toBeInstanceOf(Coordinate);
    expect(rideOutput?.to).toBeInstanceOf(Coordinate);
});

test("Must return not found when ride does not exist", async function() {
    const rideId = crypto.randomUUID();
    const returnedRide = await getRideUseCase.execute(rideId);
    expect(returnedRide).toBeUndefined();
});
