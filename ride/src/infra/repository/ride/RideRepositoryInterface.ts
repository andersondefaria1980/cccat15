import Ride from "../../../domain/entity/Ride";

export interface RideRepositoryInterface {
    addRide(rideDto: Ride): Promise<void>;
    findRide(rideId: string): Promise<Ride|undefined>;
    updateRide(rideDto: Ride): Promise<void>;
    findRidesFromPassenger(passengerId: string, status: string[], hasStatus: boolean): Promise<Ride[]>;
    findRidesFromDriver(driverId: string, status: string[], hasStatus: boolean): Promise<Ride[]>;
    listRides(): Promise<Ride[]>;
}
