export default class CoordinateDto {
    public constructor(
        private _latitude: number,
        private _longitude: number,
    ){};

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    public toApi() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
        };
    }
}
