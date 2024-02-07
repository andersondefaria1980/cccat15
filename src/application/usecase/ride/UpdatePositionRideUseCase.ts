import {PositionRepositoryInterface} from "../../../repository/position/PositionRepositoryInterface";
import RidePositionInput from "./inputOutputData/RidePositionInput";
import {RideRepositoryInterface} from "../../../repository/ride/RideRepositoryInterface";

export default class UpdatePositionRideUseCase {
    public constructor(readonly positionRepository: PositionRepositoryInterface, readonly rideRepository: RideRepositoryInterface) {}

    public async execute(input: RidePositionInput) {
        let ride = await this.rideRepository.findRide(input.rideId);
        if (!ride) throw new Error("Ride not found.");
        //parado aqui, no use case de update position
        ride.updatePosition(input)
        if (!ride.getDriverId()) throw new Error("Ride does not have a driver and cannot be started.");
        ride.start();
        await this.rideRepository.updateRide(ride);
    }
}
