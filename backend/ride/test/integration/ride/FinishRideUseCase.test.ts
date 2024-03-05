import RideRepositoryInMemory from "../../../src/infra/repository/ride/RideRepositoryInMemory";
import RideTestUtils from "./RideTestUtils";
import crypto from "crypto";
import Ride from "../../../src/domain/entity/Ride";
import FinishRideUseCase from "../../../src/application/usecase/ride/FinishRideUseCase";
import PositionRepositoryInMemory from "../../../src/infra/repository/position/PositionRepositoryInMemory";
import {AccountGateway} from "../../../src/infra/gateway/AccountGateway";
import Transaction from "../../../src/domain/entity/Transaction";
import sinon, {SinonFakeTimers, SinonMock} from "sinon";
import {PaymentGateway} from "../../../src/infra/gateway/PaymentGateway";
import UpdateRidePositionUseCase from "../../../src/application/usecase/ride/UpdateRidePositionUseCase";
import {AxiosAdapter} from "../../../src/infra/http/HttpClient";

let rideRepository: RideRepositoryInMemory;
let positionRepository: PositionRepositoryInMemory;
let rideTestUtils: RideTestUtils;
let finishRideUseCase: FinishRideUseCase;
let paymentGateway: PaymentGateway;
let accountGateway: AccountGateway;
let accountGatewayMock: SinonMock;
let paymentGatewayMock: SinonMock;

beforeEach(() => {
    rideRepository = new RideRepositoryInMemory();
    positionRepository = new PositionRepositoryInMemory();
    rideTestUtils = new RideTestUtils();
    paymentGateway = new PaymentGateway();
    accountGateway = new AccountGateway(new AxiosAdapter());
    accountGatewayMock = sinon.mock(AccountGateway.prototype);
    paymentGatewayMock = sinon.mock(PaymentGateway.prototype);
});

afterEach(() => {
    accountGatewayMock.verify();
    accountGatewayMock.restore();
    paymentGatewayMock.verify();
    paymentGatewayMock.restore();
});

test("Should throw error if ride is not found", async function() {
    const rideId = crypto.randomUUID();
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await expect(() => finishRideUseCase.execute(rideId)).rejects.toThrow(new Error(`Ride not found`));
});

test("Should throw error if passenger account is not found", async function() {
    const passengerAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    accountGatewayMock.expects("findById").once().returns(undefined);
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await expect(() => finishRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Passenger account not found`));
});

test("Should throw error if ride is not IN_PROGRESS", async function() {
    const passengerAccountId = crypto.randomUUID();
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId);
    accountGatewayMock.expects("findById").once().returns({accountId: passengerAccountId, isDriver: true});
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await expect(() => finishRideUseCase.execute(ride.rideId)).rejects.toThrow(new Error(`Invalid ride status. Ride only can be finished if status = ${Ride.STATUS_IN_PROGRESS}`));
});

test("Must finish ride and calculate distance and fare, process payment ans save transaction during day with normal fee", async function() {
    const dateStub = sinon.useFakeTimers(new Date("2024-02-26T16:00:00-03:00"));
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    const fromLat = -27.588272014187325;
    const fromLong = -48.61394608749286;
    const toLat = -27.597054794241224;
    const toLong = -48.5753934252425;
    const p1Lat = -27.59167834124668;
    const p1Long = -48.60594819997932;
    const p2Lat = -27.60216325106579;
    const p2Long = -48.596169316967064;
    const p3Lat = -27.60197198140215;
    const p3Long = -48.57916857150611;
    const p4Lat = -27.60197198140215;
    const p4Long = -48.57916857150611;
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_IN_PROGRESS, driverAccountId, fromLat, fromLong, toLat, toLong, fromLat, fromLong);
    const updatePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    await updatePosition.execute({rideId: ride.rideId, lat: p1Lat, long: p1Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p2Lat, long: p2Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p3Lat, long: p3Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p4Lat, long: p4Long});
    accountGatewayMock.expects("findById").once().returns({accountId: passengerAccountId, isDriver: true});
    paymentGatewayMock.expects("processPayment").once().returns({amount: 8.53, success: true});
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await finishRideUseCase.execute(ride.rideId);
    const finishedRide = await rideRepository.findRide(ride.rideId);
    const transactions = await rideRepository.listRideTransactions(ride.rideId);
    expect(finishedRide?.getStatus()).toBe(Ride.STATUS_COMPLETED);
    expect(finishedRide?.getDistance()).toBe(4.06);
    expect(finishedRide?.getFare()).toBe(8.53);
    expect(transactions.length).toBe(1);
    expect(transactions[0].status).toBe(Transaction.STATUS_PROCESSED);
    expect(transactions[0].amount).toBe(8.53);
    dateStub.restore();
});

test("Must finish ride and calculate distance and fare, process payment ans save transaction during the night with overnight fee", async function() {
    const dateStub = sinon.useFakeTimers(new Date("2024-02-26T23:00:00-03:00"));
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    const fromLat = -27.588272014187325;
    const fromLong = -48.61394608749286;
    const toLat = -27.597054794241224;
    const toLong = -48.5753934252425;
    const p1Lat = -27.59167834124668;
    const p1Long = -48.60594819997932;
    const p2Lat = -27.60216325106579;
    const p2Long = -48.596169316967064;
    const p3Lat = -27.60197198140215;
    const p3Long = -48.57916857150611;
    const p4Lat = -27.60197198140215;
    const p4Long = -48.57916857150611;
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_IN_PROGRESS, driverAccountId, fromLat, fromLong, toLat, toLong, fromLat, fromLong);
    const updatePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    await updatePosition.execute({rideId: ride.rideId, lat: p1Lat, long: p1Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p2Lat, long: p2Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p3Lat, long: p3Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p4Lat, long: p4Long});
    accountGatewayMock.expects("findById").once().returns({accountId: passengerAccountId, isDriver: true});
    paymentGatewayMock.expects("processPayment").once().returns({amount: 15.83, success: true});
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await finishRideUseCase.execute(ride.rideId);
    const finishedRide = await rideRepository.findRide(ride.rideId);
    const transactions = await rideRepository.listRideTransactions(ride.rideId);
    expect(finishedRide?.getStatus()).toBe(Ride.STATUS_COMPLETED);
    expect(finishedRide?.getDistance()).toBe(4.06);
    expect(finishedRide?.getFare()).toBe(15.83);
    expect(transactions.length).toBe(1);
    expect(transactions[0].status).toBe(Transaction.STATUS_PROCESSED);
    expect(transactions[0].amount).toBe(15.83);
    dateStub.restore();
});

test("Must finish ride and calculate distance and fare, process payment ans save transaction on sunday with sunday fee", async function() {
    const dateStub = sinon.useFakeTimers(new Date("2024-02-25T10:00:00-03:00"));
    const passengerAccountId = crypto.randomUUID();
    const driverAccountId = crypto.randomUUID();
    const fromLat = -27.588272014187325;
    const fromLong = -48.61394608749286;
    const toLat = -27.597054794241224;
    const toLong = -48.5753934252425;
    const p1Lat = -27.59167834124668;
    const p1Long = -48.60594819997932;
    const p2Lat = -27.60216325106579;
    const p2Long = -48.596169316967064;
    const p3Lat = -27.60197198140215;
    const p3Long = -48.57916857150611;
    const p4Lat = -27.60197198140215;
    const p4Long = -48.57916857150611;
    const ride = await RideTestUtils.createRide(rideRepository, passengerAccountId, Ride.STATUS_IN_PROGRESS, driverAccountId, fromLat, fromLong, toLat, toLong, fromLat, fromLong);
    const updatePosition = new UpdateRidePositionUseCase(positionRepository, rideRepository);
    await updatePosition.execute({rideId: ride.rideId, lat: p1Lat, long: p1Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p2Lat, long: p2Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p3Lat, long: p3Long});
    await updatePosition.execute({rideId: ride.rideId, lat: p4Lat, long: p4Long});
    accountGatewayMock.expects("findById").once().returns({accountId: passengerAccountId, isDriver: true});
    paymentGatewayMock.expects("processPayment").once().returns({amount: 11.77, success: true});
    finishRideUseCase = new FinishRideUseCase(rideRepository, positionRepository, paymentGateway, accountGateway);
    await finishRideUseCase.execute(ride.rideId);
    const finishedRide = await rideRepository.findRide(ride.rideId);
    const transactions = await rideRepository.listRideTransactions(ride.rideId);
    expect(finishedRide?.getStatus()).toBe(Ride.STATUS_COMPLETED);
    expect(finishedRide?.getDistance()).toBe(4.06);
    expect(finishedRide?.getFare()).toBe(11.77);
    expect(transactions.length).toBe(1);
    expect(transactions[0].status).toBe(Transaction.STATUS_PROCESSED);
    expect(transactions[0].amount).toBe(11.77);
    dateStub.restore();
});
