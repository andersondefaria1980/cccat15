import {PositionRepositoryInterface} from "./PositionRepositoryInterface";
import Position from "../../../domain/entity/Position";

export default class PositionRepositoryInMemory implements PositionRepositoryInterface {
    private positions : Position[] = [];

    async addPosition(position: Position): Promise<void> {
        const pos = await Position.create(position.rideId, position.getLat(), position.getLong());
        this.positions.push(pos);
    }

    async findRidePositions(rideId: string): Promise<Position[]> {
         const filteredOrderedPositions = this.positions.filter(p => p.rideId === rideId).sort((a,b) => a.date.getDate() - b.date.getDate());
         let positions: Position[] = [];
         filteredOrderedPositions.forEach(p => positions.push(Position.restore(p.positionId, p.rideId, p.getLat(), p.getLong(), p.date)));
         return this.positions;

    }
}
