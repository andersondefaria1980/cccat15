import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";

export default class StartRideUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found");
        if (!ride.getDriverId()) throw new Error("Ride does not have a driver and cannot be started.");
        ride.start();
        await this.rideRepository.updateRide(ride);
    }
}
