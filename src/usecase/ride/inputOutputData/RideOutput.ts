import CoordinateDto from "./CoordinateDto";
import Ride from "../../../domain/Ride";

export default class RideOutput {
    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        readonly passengerName: string,
        readonly status: string,
        readonly fare: number,
        readonly distance: number,
        readonly from: CoordinateDto,
        readonly to: CoordinateDto,
        readonly date: number,
        readonly driverId?: string,
        readonly driverName?: string,
    ){};

    public static create(ride: Ride) {
        return new RideOutput(ride.rideId, ride.passenger.accountId, ride.passenger.name, ride.status, ride.fare, ride.distance, ride.from, ride.to, ride.date, ride.driver?.accountId, ride.driver?.name);
    }
}
