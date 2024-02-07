import {PositionRepositoryInterface} from "./PositionRepositoryInterface";

export default class RideRepositoryInMemory implements PositionRepositoryInterface {
    addPosition(position): Promise<void> {
        return Promise.resolve(undefined);
    }
}
