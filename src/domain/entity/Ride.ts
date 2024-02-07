import Coordinate from "../../application/usecase/ride/inputOutputData/Coordinate";
import Account from "./Account";
import crypto from "crypto";

export default class Ride {

    public static STATUS_REQUESTED = "REQUESTED";
    public static STATUS_ACCEPTED = "ACCEPTED";
    public static STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static STATUS_COMPLETED = "COMPLETED";
    public static STATUS_CANCELED = "CANCELED";

    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        private status: string,
        readonly fare: number,
        readonly distance: number,
        readonly from: Coordinate,
        readonly to: Coordinate,
        readonly date: number,
        private driverId?: string,
    ){};

    public static create(passenger: string, from: Coordinate, to: Coordinate): Ride {
        const rideId = crypto.randomUUID();
        return new Ride(rideId, passenger, this.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    }

    public static restore(rideId: string, passenger: string, status: string, fare: number, distance: number, from: Coordinate, to: Coordinate, date: number, driver?: string): Ride {
        return new Ride(rideId, passenger, status, fare, distance, from, to, date, driver);
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

    getStatus(): string {
        return this.status;
    }

    getDriverId(): string|undefined {
        return this.driverId;
    }
}
