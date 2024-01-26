import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import crypto from "crypto";
import RideRepositoryInMemory from "../../../src/repository/ride/RideRepositoryInMemory";
import AccountDTO from "../../../src/domain/AccountDto";
import CoordinateDto from "../../../src/domain/CoordinateDto";
import RideDto from "../../../src/domain/RideDto";
import RideValues from "../../../src/domain/RideValues";
import ListRidesUseCase from "../../../src/usecase/ride/ListRidesUseCase";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let listRideUseCase: ListRidesUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    listRideUseCase = new ListRidesUseCase(rideRepository);
});

test("Must return a list of rides", async function() {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);
    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const rideId = crypto.randomUUID();
    const rideDto = new RideDto(rideId, accountDto, null, RideValues.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    await rideRepository.addRide(rideDto);
    
    listRideUseCase = new ListRidesUseCase(rideRepository);
    const rideList = await listRideUseCase.execute();
    expect(Array.isArray(rideList)).toBe(true);
    rideList.forEach((returnedRideDto: RideDto) => {
        expect(returnedRideDto).toBeInstanceOf(RideDto);
    })    
});
