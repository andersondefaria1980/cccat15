import CoordinateDto from "./coordinateDto";
import AccountDto from "./accountDto";

export default class RideDto {
    public constructor(
        private _rideId: string,
        private _passenger: AccountDto,
        private _driver: AccountDto | null,
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

    get driver(): AccountDto | null {
        return this._driver;
    }

    set driver(value: AccountDto | null) {
        this._driver = value;
    }

    get status(): string {
        return this._status;
    }
    set status(value: string) {
        this._status = value;
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
