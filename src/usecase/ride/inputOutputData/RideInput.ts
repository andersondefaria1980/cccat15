import CoordinateDto from "./CoordinateDto";

export default class RideInput {
    private constructor(
        readonly passengerId: string,
        readonly from: CoordinateDto,
        readonly to: CoordinateDto,
    ){};

    public static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const from = CoordinateDto.create(fromLat, fromLong);
        const to = CoordinateDto.create(toLat, toLong);
        return new RideInput(passengerId, from, to);
    }
}
