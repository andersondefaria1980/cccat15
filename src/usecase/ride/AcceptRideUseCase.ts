import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import {AccountRepositoryInterface} from "../../repository/account/AccountRepositoryInterface";
import Ride from "../../domain/Ride";

export default class AcceptRideUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(rideId: string, driverId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found.");
        if (ride.status !== Ride.STATUS_REQUESTED) throw new Error(`Ride has invalid status, ride stauts mus be ${Ride.STATUS_REQUESTED}`);

        const accountDriver = await this.accountRepository.findAccount(driverId);
        if (!accountDriver) throw new Error("Driver account not found.");

        const accountDriverId = accountDriver.accountId ? accountDriver.accountId : "";
        const driveRidesNotCompleted = await this.rideRepository.findRidesFromDriver(accountDriverId, [Ride.STATUS_ACCEPTED, Ride.STATUS_IN_PROGRESS], true);
        if (driveRidesNotCompleted.length > 0) throw new Error("Driver has another ride accepted or in progress.");

        const rideToUpdate = Ride.restore(ride.rideId, ride.passenger, accountDriver, Ride.STATUS_ACCEPTED, ride.fare, ride.distance, ride.from, ride.to, ride.date);
        await this.rideRepository.updateRide(rideToUpdate);
    }
}
