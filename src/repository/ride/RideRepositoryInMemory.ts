import {RideRepositoryInterface} from "./RideRepositoryInterface";
import Ride from "../../domain/Ride";

export default class RideRepositoryInMemory implements RideRepositoryInterface {
    private rides: Ride[] = [];

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

    public async deleteRide(rideId: string) {
        const indexOfObject = this.rides.findIndex((a) => {
            return a.rideId === rideId;
        });
        if (indexOfObject !== -1) {
            this.rides.splice(indexOfObject, 1);
        }
    }

    async findRidesFromPassenger(passengerId: string, status?: string[], hasStatus?: boolean): Promise<Ride[]> {
        if (!status || status.length == 0) return this.rides.filter(r => r.passenger.accountId === passengerId);
        return this.rides.filter(r => r.passenger.accountId === passengerId && status.filter(s => hasStatus ? (s === r.status) : (s !== r.status)));
    }

    async findRidesFromDriver(driverId: string, status?: string[], hasStatus?: boolean): Promise<Ride[]> {
        if (!status || status.length == 0) return this.rides.filter(r => r.driver?.accountId === driverId);
        return this.rides.filter(r => r.driver?.accountId === driverId && status.filter(s => hasStatus ? (s === r.status) : (s !== r.status)));
    }

    async listRides(): Promise<Ride[]> {
        return this.rides;
    }
}
