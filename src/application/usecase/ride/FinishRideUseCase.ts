import {RideRepositoryInterface} from "../../../repository/ride/RideRepositoryInterface";
import {PositionRepositoryInterface} from "../../../repository/position/PositionRepositoryInterface";

export default class FinishRideUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface, readonly positionRepository: PositionRepositoryInterface) {}

    public async execute(rideId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found");
        const positions = await this.positionRepository.findRidePositions(rideId);
        await ride.finish(positions);
        await this.rideRepository.updateRide(ride);
    }
}
