import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";

export default class DeleteRideUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        const ride = await this.rideRepository.findRide(rideId);
        if (!ride) {
            throw Error("Ride not found.");
        }
        await this.rideRepository.deleteRide(rideId);
    }
}