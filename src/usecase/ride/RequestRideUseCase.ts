import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import Ride from "../../domain/Ride";
import {AccountRepositoryInterface} from "../../repository/account/AccountRepositoryInterface";
import RideInput from "./inputOutputData/RideInput";

export default class RequestRideUseCase {
    constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(rideInput: RideInput) {
        const passengerAccount = await this.accountRepository.findAccount(rideInput.passengerId);
        if (!passengerAccount) throw new Error("Account not found.");

        const ridesNotCompleted = await this.rideRepository.findRidesFromPassenger(rideInput.passengerId, [Ride.STATUS_COMPLETED], false);
        if (ridesNotCompleted.length > 0) throw new Error("Passenger has ride not completed.");

        const ride = Ride.create(passengerAccount, rideInput.from, rideInput.to);
        await this.rideRepository.addRide(ride)
        return ride.rideId;
    }
}
