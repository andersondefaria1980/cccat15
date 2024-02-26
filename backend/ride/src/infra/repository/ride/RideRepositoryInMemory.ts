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

    async findRidesNotCompletedFromPassenger(passengerId: string): Promise<Ride[]> {
        return this.rides.filter(r => r.passengerId === passengerId && r.getStatus() !== Ride.STATUS_COMPLETED);
    }

    async findRidesNotCompletedFromDriver(driverId: string): Promise<Ride[]> {
        return this.rides.filter(r => r.getDriverId() === driverId && (r.getStatus() === Ride.STATUS_ACCEPTED || r.getStatus() === Ride.STATUS_IN_PROGRESS));
    }

    async listRides(): Promise<Ride[]> {
        return this.rides;
    }

    async addTransaction(transaction: Transaction): Promise<void> {
        this.transactions.push(transaction);
    }

    async listRideTransactions(rideId: string): Promise<Transaction[]> {
        const transactions =  this.transactions.filter(r => r.rideId === rideId);
        const list: Transaction[] = [];
        transactions.forEach((t) => {
            list.push(Transaction.restore(t.transactionId, t.rideId, t.amount, t.dateTime, t.status));
        });
        return list;
    }
}
