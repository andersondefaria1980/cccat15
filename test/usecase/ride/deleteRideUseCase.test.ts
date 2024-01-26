import crypto from "crypto";
import RideRepositoryInMemory from "../../../src/repository/ride/rideRepositoryInMemory";
import DeleteRideUseCase from "../../../src/usecase/ride/deleteRideUseCase";
import AccountDTO from "../../../src/domain/accountDto";
import CoordinateDto from "../../../src/domain/coordinateDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import RideDto from "../../../src/domain/rideDto";
import RideValues from "../../../src/domain/rideValues";

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
