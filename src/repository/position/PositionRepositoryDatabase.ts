import {PositionRepositoryInterface} from "./PositionRepositoryInterface";
import Position from "../../domain/entity/Position";
import {db} from "../../infra/database/database";

export default class PositionRepositoryDatabase implements PositionRepositoryInterface {
    async addPosition(position: Position): Promise<void> {
        await db.query("insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
            [position.positionId, position.rideId, position.getLat(), position.getLong(), position.date]);
    }
}
