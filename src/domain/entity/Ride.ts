import Coordinate from "../vo/Coordinate";
import crypto from "crypto";
import DistanceCalculator from "../ds/DistanceCalculator";

export default class Ride {

    public static STATUS_REQUESTED = "REQUESTED";
    public static STATUS_ACCEPTED = "ACCEPTED";
    public static STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static STATUS_COMPLETED = "COMPLETED";
    public static STATUS_CANCELED = "CANCELED";

    private from: Coordinate;
    private to: Coordinate;
    private lastPosition: Coordinate;

    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        private status: string,
        private fare: number,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        readonly date: Date,
        lastLat: number,
        lastLong: number,
        private distance: number,
        private driverId?: string,
    ){
        this.from = Coordinate.create(fromLat, fromLong);
        this.to = Coordinate.create(toLat, toLong);
        this.lastPosition = Coordinate.create(lastLat, lastLong);
    };

    public static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number): Ride {
        const rideId = crypto.randomUUID();
        const status = this.STATUS_REQUESTED;
        const date = new Date();
        return new Ride(rideId, passengerId, status, 0, fromLat, fromLong, toLat, toLong, date, fromLat, fromLong, 0);
    }

    public static restore(rideId: string, passengerId: string, status: string, fare: number, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date, lastLat: number, lastLong: number, distance: number, driver?: string): Ride {
        return new Ride(rideId, passengerId, status, fare, fromLat , fromLong, toLat, toLong, date, lastLat, lastLong, distance, driver);
    }

    accept(driverId: string): void {
        if (this.status !== Ride.STATUS_REQUESTED) throw new Error(`Ride has invalid status, ride stauts mus be ${Ride.STATUS_REQUESTED}`);
        this.status = Ride.STATUS_ACCEPTED;
        this.driverId = driverId;
    }

    start(): void {
        if (this.status !== Ride.STATUS_ACCEPTED) throw new Error(`Ride can be started only if status = ${Ride.STATUS_ACCEPTED}. Ride status is ${this.status}`);
        this.status = Ride.STATUS_IN_PROGRESS;
    }

    async updatePosition(lat: number, long: number): Promise<void> {
        if (this.status !== Ride.STATUS_IN_PROGRESS) throw new Error(`Invalid ride status. Position only can be update if status = ${Ride.STATUS_IN_PROGRESS}`);
        const actualPosition = await Coordinate.create(lat, long);
        this.distance = await DistanceCalculator.calculateDistanceFromCoordinates(this.lastPosition, actualPosition);
        this.lastPosition = actualPosition;
    }

    getStatus(): string {
        return this.status;
    }

    getDriverId(): string|undefined {
        return this.driverId;
    }

    getFromLat(): number {
        return this.from.latitude;
    }

    getFromLong(): number {
        return this.from.longitude;
    }

    getToLat(): number {
        return this.to.latitude;
    }

    getToLong(): number {
        return this.to.longitude;
    }

    getFare(): number {
        return this.fare;
    }

    getDistance(): number {
        return this.distance;
    }

    getLastLat(): number {
        return this.lastPosition.latitude;
    }

    getLastLong(): number {
        return this.lastPosition.longitude;
    }
}
