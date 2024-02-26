import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";
import {PositionRepositoryInterface} from "../../../infra/repository/position/PositionRepositoryInterface";
import PaymentGateway from "../../../infra/gateway/PaymentGateway";
import {AccountGateway} from "../../../infra/gateway/AccountGateway";
import Transaction from "../../../domain/entity/Transaction";

export default class FinishRideUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly positionRepository: PositionRepositoryInterface,
        readonly paymentGateway: PaymentGateway,
        readonly accountGateway: AccountGateway,
    ) {
    }

    public async execute(rideId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found");
        const passengerAccount = await this.accountGateway.findById(ride.passengerId);
        if (!passengerAccount) throw new Error("Passenger account not found");
        const positions = await this.positionRepository.findRidePositions(rideId);
        await ride.finish(positions);
        await this.rideRepository.updateRide(ride);
        const creditCardToken = passengerAccount.creditCardToken;
        const payment = await this.paymentGateway.processPayment(ride.rideId, creditCardToken, ride.getFare());
        const transaction = await Transaction.create(rideId, payment.amount, payment.success);
        await this.rideRepository.addTransaction(transaction);
    }
}
