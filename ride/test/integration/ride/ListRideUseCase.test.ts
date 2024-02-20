import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import ListRidesUseCase from "../../../src/application/usecase/ride/ListRidesUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/application/usecase/ride/inputOutputData/RideOutput";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";

let rideRepository: RideRepositoryInMemory;
let listRideUseCase: ListRidesUseCase;
let accountGateway: AccountGateway;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountGateway = new AccountGateway();
    listRideUseCase = new ListRidesUseCase(rideRepository, accountGateway);
});

test("Must return a list of rides", async function() {
    const passengerAccountId = await RideTestUtils.createAccount(true, false);
    const driverAccountId = await RideTestUtils.createAccount(true, true);
    await RideTestUtils.createRide(rideRepository, passengerAccountId, undefined,  driverAccountId);
    const rideList = await listRideUseCase.execute();
    expect(Array.isArray(rideList)).toBe(true);
    rideList.forEach((rideOutput) => {
        expect(rideOutput).toBeInstanceOf(RideOutput);
    })    
});
