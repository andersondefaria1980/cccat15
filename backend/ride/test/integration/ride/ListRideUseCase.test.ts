import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import ListRidesUseCase from "../../../src/application/usecase/ride/ListRidesUseCase";
import RideTestUtils from "./RideTestUtils";
import RideOutput from "../../../src/application/usecase/ride/inputOutputData/RideOutput";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";
import sinon, {SinonMock} from "sinon";
import crypto from "crypto";

let rideRepository: RideRepositoryInMemory;
let listRideUseCase: ListRidesUseCase;
let accountGateway: AccountGateway;
let accountGatewayMock: SinonMock;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountGateway = new AccountGateway();
    listRideUseCase = new ListRidesUseCase(rideRepository, accountGateway);
    accountGatewayMock = sinon.mock(AccountGateway.prototype);
});

afterEach(() => {
    accountGatewayMock.verify();
    accountGatewayMock.restore();
});

test("Must return a list of rides", async function() {
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    await RideTestUtils.createRide(rideRepository, passengerAccountId, undefined,  driverAccountId);
    const rideList = await listRideUseCase.execute();
    expect(Array.isArray(rideList)).toBe(true);
    rideList.forEach((rideOutput) => {
        expect(rideOutput).toBeInstanceOf(RideOutput);
    })    
});
