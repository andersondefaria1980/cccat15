import Coordinate from "../vo/Coordinate";
import crypto from "crypto";

export default class Position {
    private position: Coordinate;

    constructor(
        readonly positionId: string,
        readonly rideId: string,
        lat: number,
        long: number,
        readonly date: Date,
    ) {
        this.position = Coordinate.create(lat, long);
    }

    public static async create(rideId: string, lat: number, long: number) {
        const positionId = crypto.randomUUID();
        return new Position(positionId, rideId, lat, long, new Date());
    }

    getLat() {
        return this.position.latitude;
    }

    getLong() {
        return this.position.longitude;
    }
}
