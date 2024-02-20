import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";
import Ride from "../../../domain/entity/Ride";
import RideInput from "./inputOutputData/RideInput";
import {AccountGateway} from "../../../infra/gateway/AccountGateway";

export default class RequestRideUseCase {
    constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountGateway: AccountGateway
    ) {}

    public async execute(rideInput: RideInput) {
        const passengerAccount = await this.accountGateway.findById(rideInput.passengerId);
        if (!passengerAccount) throw new Error("Account not found.");
        if (!passengerAccount.isPassenger) throw new Error("Passenger account is not passenger.");
        const ridesNotCompleted = await this.rideRepository.findRidesFromPassenger(rideInput.passengerId, [Ride.STATUS_COMPLETED], false);
        if (ridesNotCompleted.length > 0) throw new Error("Passenger has ride not completed.");
        const ride = Ride.create(rideInput.passengerId, rideInput.from.latitude, rideInput.from.longitude, rideInput.to.latitude, rideInput.to.longitude);
        await this.rideRepository.addRide(ride)
        return ride.rideId;
    }
}
