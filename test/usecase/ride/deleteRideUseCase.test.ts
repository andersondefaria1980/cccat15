import crypto from "crypto";
import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import DeleteRideUseCase from "../../../src/usecase/ride/DeleteRideUseCase";
import AccountDTO from "../../../src/domain/AccountDto";
import CoordinateDto from "../../../src/domain/CoordinateDto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import RideDto from "../../../src/domain/RideDto";
import RideValues from "../../../src/domain/RideValues";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let deleteRideUseCase: DeleteRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    deleteRideUseCase = new DeleteRideUseCase(rideRepository);
});

test("Must delete an ride", async function() {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const rideId = crypto.randomUUID();
    const rideDto = new RideDto(rideId, accountDto, null, RideValues.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    await rideRepository.addRide(rideDto);
    deleteRideUseCase = new DeleteRideUseCase(rideRepository);
    await deleteRideUseCase.execute(rideId);
    const rideFound = await rideRepository.findRide(rideId);
    expect(rideFound).toBe(undefined);
});

test("Must return error if ride does not exists", async function() {
    const id = crypto.randomUUID();
    await expect(() => deleteRideUseCase.execute(id)).rejects.toThrow(new Error("Ride not found."))
});
