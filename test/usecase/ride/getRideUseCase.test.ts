import RideRepositoryInMemory from "../../../src/repository/ride/rideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import crypto from "crypto";
import AccountDTO from "../../../src/domain/accountDto";
import CoordinateDto from "../../../src/domain/coordinateDto";
import RideDto from "../../../src/domain/rideDto";
import RequestRideUseCase from "../../../src/usecase/ride/requestRideUseCase";
import GetRideUseCase from "../../../src/usecase/ride/gerRideUseCase";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let getRideUseCase: GetRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    getRideUseCase = new GetRideUseCase(rideRepository);
})

test("Must return a ride", async function () {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const rideId = crypto.randomUUID();
    const rideDto = new RideDto(rideId, accountDto, null, RequestRideUseCase.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    rideRepository.addRide(rideDto);
    const ride = await getRideUseCase.execute(rideId);
    expect(ride).toBeInstanceOf(RideDto);
});

test("Must return not found when ride does not exist", async function() {
    const rideId = crypto.randomUUID();
    await expect(() => getRideUseCase.execute(rideId)).rejects.toThrow(new Error("Ride not found."));
});