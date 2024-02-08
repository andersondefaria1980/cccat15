import {PositionRepositoryInterface} from "./PositionRepositoryInterface";
import Position from "../../domain/entity/Position";

export default class PositionRepositoryInMemory implements PositionRepositoryInterface {
    private positions : Position[] = [];

    async addPosition(position: Position): Promise<void> {
        this.positions.push(position);
    }
}
