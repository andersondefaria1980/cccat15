import Ride from "../../../../domain/entity/Ride";

export default class RideOutput {
    private constructor(
        readonly rideId: string,
        readonly status: string,
        readonly fare: number,
        readonly distance: number,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        readonly lastLat: number,
        readonly lastLong: number,
        readonly date: Date,
        readonly passengerId?: string,
        readonly passengerName?: string,
        readonly driverId?: string,
        readonly driverName?: string,
    ){};

    public static create(ride: Ride, passengerName?: string, driverName?: string) {
        return new RideOutput(
            ride.rideId,
            ride.getStatus(),
            ride.getFare(),
            ride.getDistance(),
            ride.getFromLat(),
            ride.getFromLong(),
            ride.getToLat(),
            ride.getToLong(),
            ride.getLastLat(),
            ride.getLastLong(),
            ride.date,
            ride.passengerId,
            passengerName,
            ride.getDriverId(),
            driverName,
        );
    }
}
