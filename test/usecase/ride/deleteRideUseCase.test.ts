import crypto from "crypto";
import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import DeleteRideUseCase from "../../../src/usecase/ride/DeleteRideUseCase";
import CoordinateDto from "../../../src/usecase/ride/inputOutputData/CoordinateDto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let deleteRideUseCase: DeleteRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    deleteRideUseCase = new DeleteRideUseCase(rideRepository);
});

test("Must delete an ride", async function() {
    const passengerAccount = await RideTestUtils.createAccount(accountRepository, true, false);
    const from = CoordinateDto.create(1,2);
    const to = CoordinateDto.create(5,6);
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccount);
    deleteRideUseCase = new DeleteRideUseCase(rideRepository);
    await deleteRideUseCase.execute(ride.rideId);
    const rideFound = await rideRepository.findRide(ride.rideId);
    expect(rideFound).toBe(undefined);
});

test("Must return error if ride does not exists", async function() {
    const id = crypto.randomUUID();
    await expect(() => deleteRideUseCase.execute(id)).rejects.toThrow(new Error("Ride not found."))
});
