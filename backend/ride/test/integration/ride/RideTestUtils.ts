import Ride from "../../../src/domain/entity/Ride";
import {RideRepositoryInterface} from "../../../src/infra/repository/ride/RideRepositoryInterface";
import Position from "../../../src/domain/entity/Position";
import {PositionRepositoryInterface} from "../../../src/infra/repository/position/PositionRepositoryInterface";
import axios from "axios";
import crypto from "crypto";

export default class RideTestUtils {

    public static async createRide(
        rideRepository: RideRepositoryInterface,
        passengerId: string,
        status: string = Ride.STATUS_REQUESTED,
        driverId?: string,
        fromLat?: number,
        fromLong?: number,
        toLat?: number,
        toLong?: number,
        lastLat?: number,
        lastLong?: number,
    ): Promise<Ride> {
        const fLat = fromLat ? +fromLat : 1;
        const fLong = fromLong ? +fromLong : 2;
        const tLat = toLat ? +toLat : 3;
        const tLong = toLong ? +toLong : 4;
        const lLat = lastLat ? +lastLat : 3;
        const lLong = lastLong ? +lastLong : 4;
        const rideCreated = Ride.create(passengerId, fLat, fLong, tLat, tLong);
        const rideRestored = Ride.restore(rideCreated.rideId, passengerId, status, 0, fLat, fLong, tLat, tLong, rideCreated.date, rideCreated.getLastLat(), rideCreated.getLastLong(), rideCreated.getDistance(), driverId);
        await rideRepository.addRide(rideRestored);
        return rideRestored;
    }

    public static async addPosition(
        positionRepository: PositionRepositoryInterface,
        rideId: string,
        lat: number,
        long: number
    ) {
        const position = await Position.create(rideId, lat, long);
        await positionRepository.addPosition(position);
    }
}
