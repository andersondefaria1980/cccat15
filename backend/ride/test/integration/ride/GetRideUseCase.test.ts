import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import crypto from "crypto";
import Coordinate from "../../../src/domain/vo/Coordinate";
import GetRideUseCase from "../../../src/application/usecase/ride/GetRideUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/application/usecase/ride/inputOutputData/RideOutput";

let rideRepository: RideRepositoryInMemory;
let getRideUseCase: GetRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    getRideUseCase = new GetRideUseCase(rideRepository);
})

test("Must return a ride", async function () {
    const passengerAccountId = crypto.randomUUID();
    const from = Coordinate.create(1,2);
    const to = Coordinate.create(5,6);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    const rideOutput = await getRideUseCase.execute(ride.rideId);
    expect(rideOutput).toBeInstanceOf(RideOutput);
    expect(typeof rideOutput?.fare).toBe("number");
    expect(typeof rideOutput?.distance).toBe("number");
    expect(rideOutput?.date).toBeInstanceOf(Date);
    expect(typeof rideOutput?.fromLat).toBe("number");
    expect(typeof rideOutput?.fromLong).toBe("number");
    expect(typeof rideOutput?.toLat).toBe("number");
    expect(typeof rideOutput?.toLong).toBe("number");
    expect(typeof rideOutput?.lastLat).toBe("number");
    expect(typeof rideOutput?.lastLong).toBe("number");

});

test("Must return not found when ride does not exist", async function() {
    const rideId = crypto.randomUUID();
    const returnedRide = await getRideUseCase.execute(rideId);
    expect(returnedRide).toBeUndefined();
});

test("Must return not found when uuid is not in the right format", async function() {
    const rideId = "AAA";
    const returnedRide = await getRideUseCase.execute(rideId);
    expect(returnedRide).toBeUndefined();
});
