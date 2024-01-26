import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import {AccountRepositoryInterface} from "../../repository/account/AccountRepositoryInterface";
import RideValues from "../../domain/RideValues";

export default class AcceptRideUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(rideId: string, driverId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found.");
        if (ride.status !== RideValues.STATUS_REQUESTED) throw new Error(`Ride has invalid status, ride stauts mus be ${RideValues.STATUS_REQUESTED}`);

        const accountDriver = await this.accountRepository.findAccount(driverId);
        if (!accountDriver) throw new Error("Driver account not found.");
        if (!accountDriver.isDriver) throw new Error("Driver account is not set as a driver.");

        const accountDriverId = accountDriver.accountId ? accountDriver.accountId : "";
        const driveRidesNotCompleted = await this.rideRepository.findRidesFromDriver(accountDriverId, [RideValues.STATUS_ACCEPTED, RideValues.STATUS_IN_PROGRESS], true);
        if (driveRidesNotCompleted.length > 0) throw new Error("Driver has another ride accepted or in progress.");

        ride.driver = accountDriver;
        ride.status = RideValues.STATUS_ACCEPTED;
        await this.rideRepository.updateRide(ride);
    }
}
