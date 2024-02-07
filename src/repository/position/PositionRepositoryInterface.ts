import Ride from "../../domain/entity/Ride";

export interface PositionRepositoryInterface {
    addPosition(position): Promise<void>;
}
