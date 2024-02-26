import Ride from "../../../domain/entity/Ride";
import Transaction from "../../../domain/entity/Transaction";

export interface RideRepositoryInterface {
    addRide(rideDto: Ride): Promise<void>;
    findRide(rideId: string): Promise<Ride|undefined>;
    updateRide(rideDto: Ride): Promise<void>;
    findRidesFromPassenger(passengerId: string, status: string[], hasStatus: boolean): Promise<Ride[]>;
    findRidesFromDriver(driverId: string, status: string[], hasStatus: boolean): Promise<Ride[]>;
    listRides(): Promise<Ride[]>;
    addTransaction(transaction: Transaction): Promise<void>;
    findTransaction(transactionId: string): Promise<Transaction|undefined>;
    listRideTransactions(rideId: string): Promise<Transaction[]>;
}
