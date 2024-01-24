import CoordinateDto from "./coordinateDto";

export default class RideDto {
    public constructor(
        private _rideId: string,
        private _passengetId: string,
        private _driverId: string|null,
        private _status: string,
        private _fare: number,
        private _distance: number,
        private _from: CoordinateDto,
        private _to: CoordinateDto,
        private _date: number,
    ){};

    get rideId(): string {
        return this._rideId;
    }

    get passengetId(): string {
        return this._passengetId;
    }

    get driverId(): string | null {
        return this._driverId;
    }

    get status(): string {
        return this._status;
    }

    get fare(): number {
        return this._fare;
    }

    get distance(): number {
        return this._distance;
    }

    get from(): CoordinateDto {
        return this._from;
    }

    get to(): CoordinateDto {
        return this._to;
    }

    get date(): number {
        return this._date;
    }
}
