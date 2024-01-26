import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";

export default class GetRideUseCase {
    public constructor(private rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string) {
        return await this.rideRepository.findRide(rideId);
    }
}
