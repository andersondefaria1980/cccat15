export default class Coordinate {
    private constructor(
        readonly latitude: number,
        readonly longitude: number,
    ){
        if (latitude > 90 || latitude < -90) throw new Error("Latitude is invalid")
        if (longitude > 180 || longitude < -180) throw new Error("Longitude is invalid")
    };

    public static create(lat:number, long: number) {
        return new Coordinate(lat, long);
    }
}
