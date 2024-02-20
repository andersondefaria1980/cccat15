import Position from "../../../domain/entity/Position";

export interface PositionRepositoryInterface {
    addPosition(position: Position): Promise<void>;
    findRidePositions(rideId: string): Promise<Position[]>;
}
