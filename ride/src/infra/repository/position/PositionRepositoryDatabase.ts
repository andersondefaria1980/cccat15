import {PositionRepositoryInterface} from "./PositionRepositoryInterface";
import Position from "../../../domain/entity/Position";
import {db} from "../../database/database";
import Ride from "../../../domain/entity/Ride";

export default class PositionRepositoryDatabase implements PositionRepositoryInterface {

    async addPosition(position: Position): Promise<void> {
        await db.query("insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
            [position.positionId, position.rideId, position.getLat(), position.getLong(), position.date]);
    }

    async findRidePositions(rideId: string): Promise<Position[]> {
        let sql = `select p.position_id, p.ride_id, p.lat, p.long, p.date from cccat15.position p where p.ride_id = $1`;
        let parameters: string[] = [rideId];
        const positionDbList = await db.any(sql, parameters);
        const positionList: Position[] = [];
        positionDbList.forEach((p) => {
            positionList.push(this.getPositionFromDb(p));
        });
        return positionList;
    }

    private getPositionFromDb(positionDb: any): Position {
        return Position.restore(positionDb.position_id, positionDb.ride_id, parseFloat(positionDb.lat), parseFloat(positionDb.long), positionDb.date);
    }
}
