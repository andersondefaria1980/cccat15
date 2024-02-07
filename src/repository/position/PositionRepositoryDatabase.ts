import {PositionRepositoryInterface} from "./PositionRepositoryInterface";

export default class PositionRepositoryDatabase implements PositionRepositoryInterface {
    addPosition(position): Promise<void> {
        return Promise.resolve(undefined);
    }
}
