import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import RequestRideUseCase from "../../../src/application/usecase/ride/RequestRideUseCase";
import RideInput from "../../../src/application/usecase/ride/inputOutputData/RideInput";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";
import RideTestUtils from "./RideTestUtils";

let rideRepository: RideRepositoryInMemory;
let requestRideUseCase: RequestRideUseCase;
let accountGateway: AccountGateway;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    accountGateway = new AccountGateway();
    requestRideUseCase = new RequestRideUseCase(rideRepository, accountGateway);
})

test("Must request a ride", async function() {
    const accountPassengerId = await RideTestUtils.createAccount(true, false);
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    const rideId = await requestRideUseCase.execute(rideInput);
    expect(typeof(rideId)).toBe("string");
});

test("Must return error if account not found", async function () {
    const accountId = 'AAA';
    const rideInput = RideInput.create(accountId, 1,2,5,6);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Account not found."));
});

test("Must return error if account is not passenger", async function () {
    const accountPassengerId = await RideTestUtils.createAccount(false, true);
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger account is not passenger."));
});

test("Must return error if passenger has any ride not completed", async function () {
    const accountPassengerId = await RideTestUtils.createAccount(true, false);
    const rideInput = RideInput.create(accountPassengerId, 1,2,5,6);
    await requestRideUseCase.execute(rideInput);
    await expect(() => requestRideUseCase.execute(rideInput)).rejects.toThrow(new Error("Passenger has ride not completed."));
});
