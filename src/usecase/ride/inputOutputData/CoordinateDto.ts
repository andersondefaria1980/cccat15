export default class CoordinateDto {
    private constructor(
        readonly latitude: number,
        readonly longitude: number,
    ){};

    public static create(lat:number, long: number) {
        return new CoordinateDto(lat, long);
    }
}
