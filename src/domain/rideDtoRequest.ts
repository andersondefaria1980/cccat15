import CoordinateDto from "./coordinateDto";

export default class RideDtoRequest {
    public constructor(
        private _passengetId: string,
        private _from: CoordinateDto,
        private _to: CoordinateDto,
    ){};

    get passengetId(): string {
        return this._passengetId;
    }

    get from(): CoordinateDto {
        return this._from;
    }

    get to(): CoordinateDto {
        return this._to;
    }
}
