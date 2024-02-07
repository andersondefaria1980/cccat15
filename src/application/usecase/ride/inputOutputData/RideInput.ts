import Coordinate from "./Coordinate";

export default class RideInput {
    private constructor(
        readonly passengerId: string,
        readonly from: Coordinate,
        readonly to: Coordinate,
    ){};

    public static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const from = Coordinate.create(fromLat, fromLong);
        const to = Coordinate.create(toLat, toLong);
        return new RideInput(passengerId, from, to);
    }
}
