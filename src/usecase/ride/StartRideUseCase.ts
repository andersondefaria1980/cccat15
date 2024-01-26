import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import RideValues from "../../domain/RideValues";

export default class StartRideUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found.");
        if (!ride.driver) throw new Error("Ride does not have a driver and cannot be started.");
        if (ride.status !== RideValues.STATUS_ACCEPTED) throw new Error(`Ride can be started only if status = ${RideValues.STATUS_ACCEPTED}. Ride status is ${ride.status}`);
        ride.status = RideValues.STATUS_IN_PROGRESS;
        await this.rideRepository.updateRide(ride);
    }
}
