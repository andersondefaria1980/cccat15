import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";

export default class GetRideUseCase {
    public constructor(private rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        const ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw Error("Ride not found.");
        return ride;
    }
}