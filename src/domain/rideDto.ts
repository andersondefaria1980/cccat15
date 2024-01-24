import CoordinateDto from "./coordinateDto";
import AccountDto from "./accountDto";

export default class RideDto {
    public constructor(
        private _rideId: string,
        private _passenger: AccountDto,
        private _driverId: AccountDto | null,
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

    get passenger(): AccountDto {
        return this._passenger;
    }

    get driverId(): AccountDto | null {
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
