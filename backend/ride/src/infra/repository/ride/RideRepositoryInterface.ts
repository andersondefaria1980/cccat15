import Ride from "../../../domain/entity/Ride";
import Transaction from "../../../domain/entity/Transaction";

export interface RideRepositoryInterface {
    addRide(rideDto: Ride): Promise<void>;
    findRide(rideId: string): Promise<Ride|undefined>;
    updateRide(rideDto: Ride): Promise<void>;
    findRidesNotCompletedFromPassenger(passengerId: string): Promise<Ride[]>;
    findRidesNotCompletedFromDriver(driverId: string): Promise<Ride[]>;
    listRides(): Promise<Ride[]>;
    addTransaction(transaction: Transaction): Promise<void>;
    listRideTransactions(rideId: string): Promise<Transaction[]>;
}
