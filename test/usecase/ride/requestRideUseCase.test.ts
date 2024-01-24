import RideDtoRequest from "../../../src/domain/rideDtoRequest";
import RideRepositoryInMemory from "../../../src/repository/ride/rideRepositoryInMemory";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import AccountDTO from "../../../src/domain/accountDto";
import crypto from "crypto";
import CoordinateDto from "../../../src/domain/coordinateDto";
import RequestRideUseCase from "../../../src/usecase/ride/requestRideUseCase";

let rideRepository: RideRepositoryInMemory;
let accountRepository: AccountRepositoryInMemory;
let requestRideUseCase: RequestRideUseCase;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountRepository = new AccountRepositoryInMemory();
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountRepository);
})

test("Must request a ride", async function() {
    const accountId = crypto.randomUUID();
    const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", true, false);
    await accountRepository.addAccount(accountDto);

    const from = new CoordinateDto(1,2);
    const to = new CoordinateDto(5,6);
    const requestRideDto = new RideDtoRequest(accountId, from, to);

    const rideId = await requestRideUseCase.execute(requestRideDto);
    expect(typeof(rideId)).toBe("string");
});


