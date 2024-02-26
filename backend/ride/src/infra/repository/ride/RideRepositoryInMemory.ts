import {RideRepositoryInterface} from "./RideRepositoryInterface";
import Ride from "../../../domain/entity/Ride";
import Transaction from "../../../domain/entity/Transaction";

export default class RideRepositoryInMemory implements RideRepositoryInterface {
    private rides: Ride[] = [];
    private transactions: Transaction[] = [];

    public async addRide(rideDto: Ride) {
        this.rides.push(rideDto);
    }

    async findRide(rideId: string): Promise<Ride | undefined> {
        return await this.rides.find(r => r.rideId === rideId);
    }

    async updateRide(rideDto: Ride): Promise<void> {
        const indexOfObject = this.rides.findIndex((a) => {
            return a.rideId === rideDto.rideId;
        });
        if (indexOfObject !== -1) {
            this.rides[indexOfObject] = rideDto;
        }
    }

    async findRidesFromPassenger(passengerId: string, status: string[], hasStatus: boolean): Promise<Ride[]> {
        return this.rides.filter(r => r.passengerId === passengerId && status.filter(s => hasStatus ? (s === r.getStatus()) : (s !== r.getStatus())));
    }

    async findRidesFromDriver(driverId: string, status: string[], hasStatus: boolean): Promise<Ride[]> {
        return this.rides.filter(r => r.getDriverId() === driverId && status.filter(s => hasStatus ? (s === r.getStatus()) : (s !== r.getStatus())));
    }

    async listRides(): Promise<Ride[]> {
        return this.rides;
    }

    async addTransaction(transaction: Transaction): Promise<void> {
        this.transactions.push(transaction);
    }

    async findTransaction(transactionId: string): Promise<Transaction | undefined> {
        return await this.transactions.find(r => r.transactionId === transactionId);
    }

    async listRideTransactions(rideId: string): Promise<Transaction[]> {
        return this.transactions.filter(r => r.rideId === rideId);
    }
}
