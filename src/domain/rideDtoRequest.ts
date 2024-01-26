import CoordinateDto from "./coordinateDto";

export default class RideDtoRequest {
    public constructor(
        private _passengerId: string,
        private _from: CoordinateDto,
        private _to: CoordinateDto,
    ){};

    get passengerId(): string {
        return this._passengerId;
    }

    get from(): CoordinateDto {
        return this._from;
    }

    get to(): CoordinateDto {
        return this._to;
    }

}
