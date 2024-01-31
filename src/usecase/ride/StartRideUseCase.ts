import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import Ride from "../../domain/Ride";

export default class StartRideUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found.");
        if (!ride.driver) throw new Error("Ride does not have a driver and cannot be started.");
        if (ride.status !== Ride.STATUS_ACCEPTED) throw new Error(`Ride can be started only if status = ${Ride.STATUS_ACCEPTED}. Ride status is ${ride.status}`);
        const rideToUpdate = Ride.restore(ride.rideId, ride.passenger, ride.driver, Ride.STATUS_IN_PROGRESS, ride.fare, ride.distance, ride.from, ride.to, ride.date);
        await this.rideRepository.updateRide(rideToUpdate);
    }
}
