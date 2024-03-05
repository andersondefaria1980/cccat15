import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import RequestRideUseCase from "../../../src/application/usecase/ride/RequestRideUseCase";
import RideInput from "../../../src/application/usecase/ride/inputOutputData/RideInput";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";
import sinon, {SinonMock} from "sinon";
import crypto from "crypto";
import {AxiosAdapter} from "../../../src/infra/http/HttpClient";

let rideRepository: RideRepositoryInMemory;
let requestRideUseCase: RequestRideUseCase;
let accountGateway: AccountGateway;
let accountGatewayMock: SinonMock;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountGateway = new AccountGateway(new AxiosAdapter());
    accountGatewayMock = sinon.mock(AccountGateway.prototype);
});

afterEach(() => {
    accountGatewayMock.verify();
    accountGatewayMock.restore();
});

test("Must request a ride", async function() {
    const accountPassengerId = crypto.randomUUID();
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    accountGatewayMock.expects("findById").once().returns({accountId: accountPassengerId, isPassenger: true});
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountGateway);
    const rideId = await requestRideUseCase.execute(rideInput);
    expect(typeof(rideId)).toBe("string");
});

test("Must return error if account not found", async function () {
    const accountId = 'AAA';
    const rideInput = RideInput.create(accountId, 1,2,5,6);
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountGateway);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Account not found."));
});

test("Must return error if account is not passenger", async function () {
    const accountPassengerId = crypto.randomUUID();
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    accountGatewayMock.expects("findById").once().returns({accountId: accountPassengerId, isPassenger: false});
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountGateway);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger account is not passenger."));
});

test("Must return error if passenger has any ride not completed", async function () {
    const accountPassengerId = crypto.randomUUID();
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    accountGatewayMock.expects("findById").twice().returns({accountId: accountPassengerId, isPassenger: true});
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountGateway);
    await requestRideUseCase.execute(rideInput);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger has ride not completed."));
});
