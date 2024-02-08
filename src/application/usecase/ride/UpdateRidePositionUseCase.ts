import {PositionRepositoryInterface} from "../../../repository/position/PositionRepositoryInterface";
import RidePositionInput from "./inputOutputData/RidePositionInput";
import {RideRepositoryInterface} from "../../../repository/ride/RideRepositoryInterface";
import Position from "../../../domain/entity/Position";

export default class UpdateRidePositionUseCase {
    public constructor(readonly positionRepository: PositionRepositoryInterface, readonly rideRepository: RideRepositoryInterface) {}

    public async execute(input: RidePositionInput) {
        let ride = await this.rideRepository.findRide(input.rideId);
        if (!ride) throw new Error("Ride not found");
        await ride.updatePosition(input.lat, input.long);
        const position = await Position.create(input.rideId, input.lat, input.long);
        await this.rideRepository.updateRide(ride);
        await this.positionRepository.addPosition(position);
    }
}
