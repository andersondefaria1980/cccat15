import CoordinateDto from "../usecase/ride/inputOutputData/CoordinateDto";
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
        readonly passenger: Account,
        readonly driver: Account | null,
        readonly status: string,
        readonly fare: number,
        readonly distance: number,
        readonly from: CoordinateDto,
        readonly to: CoordinateDto,
        readonly date: number,
    ){
        this.validateRide();
    };

    public static create(passenger: Account, from: CoordinateDto, to: CoordinateDto): Ride {
        const rideId = crypto.randomUUID();
        return new Ride(rideId, passenger, null, this.STATUS_REQUESTED, 0, 0, from, to, Date.now());
    }

    public static restore(rideId: string, passenger: Account, driver: Account|null, status: string, fare: number, distance: number, from: CoordinateDto, to: CoordinateDto, date: number): Ride {
        return new Ride(rideId, passenger, driver, status, fare, distance, from, to, date);
    }

    private validateRide() {
        if (!this.passenger.isPassenger) throw new Error("Passenger account is not passenger.");
        if (this.driver && !this.driver.isDriver) throw new Error("Driver account is not set as a driver.");
    }
}
