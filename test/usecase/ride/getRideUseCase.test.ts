import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import AccountDTO from "../../../src/domain/AccountDto";
import CoordinateDto from "../../../src/domain/CoordinateDto";
import RideDto from "../../../src/domain/RideDto";
import GetRideUseCase from "../../../src/usecase/ride/GetRideUseCase";
import RideValues from "../../../src/domain/RideValues";

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
    const rideDto = new RideDto(rideId, accountDto, null, RideValues.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    rideRepository.addRide(rideDto);
    const ride = await getRideUseCase.execute(rideId);
    expect(ride).toBeInstanceOf(RideDto);
    expect(typeof ride?.fare).toBe("number");
    expect(typeof ride?.distance).toBe("number");
    expect(typeof ride?.date).toBe("number");
    expect(ride?.from).toBeInstanceOf(CoordinateDto);
    expect(ride?.to).toBeInstanceOf(CoordinateDto);
    expect(typeof ride?.toApi()).toBe("object");
});

test("Must return not found when ride does not exist", async function() {
    const rideId = crypto.randomUUID();
    const returnedRideDto = await getRideUseCase.execute(rideId);
    expect(returnedRideDto).toBeUndefined;
});
