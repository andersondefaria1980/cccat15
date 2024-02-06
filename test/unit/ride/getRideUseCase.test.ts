import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import AccountDTO from "../../../src/usecase/account/inputOutputData/AccountInput";
import CoordinateDto from "../../../src/usecase/ride/inputOutputData/CoordinateDto";
import Ride from "../../../src/domain/Ride";
import GetRideUseCase from "../../../src/usecase/ride/GetRideUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/usecase/ride/inputOutputData/RideOutput";

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
    const from = CoordinateDto.create(1,2);
    const to = CoordinateDto.create(5,6);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount);
    const rideOutput = await getRideUseCase.execute(ride.rideId);
    expect(rideOutput).toBeInstanceOf(RideOutput);
    expect(typeof rideOutput?.fare).toBe("number");
    expect(typeof rideOutput?.distance).toBe("number");
    expect(typeof rideOutput?.date).toBe("number");
    expect(rideOutput?.from).toBeInstanceOf(CoordinateDto);
    expect(rideOutput?.to).toBeInstanceOf(CoordinateDto);
});

test("Must return not found when ride does not exist", async function() {
    const rideId = crypto.randomUUID();
    const returnedRide = await getRideUseCase.execute(rideId);
    expect(returnedRide).toBeUndefined();
});
