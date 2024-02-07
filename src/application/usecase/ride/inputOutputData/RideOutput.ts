import Coordinate from "./Coordinate";
import Ride from "../../../../domain/entity/Ride";
import Account from "../../../../domain/entity/Account";

export default class RideOutput {
    private constructor(
        readonly rideId: string,
        readonly status: string,
        readonly fare: number,
        readonly distance: number,
        readonly from: Coordinate,
        readonly to: Coordinate,
        readonly date: number,
        readonly passengerId?: string,
        readonly passengerName?: string,
        readonly driverId?: string,
        readonly driverName?: string,
    ){};

    public static create(ride: Ride, passenger?: Account, driver?: Account) {
        return new RideOutput(ride.rideId, ride.getStatus(), ride.fare, ride.distance, ride.from, ride.to, ride.date, ride.passengerId, passenger?.getName(), ride.getDriverId(), driver?.getName());
    }
}
