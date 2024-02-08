import {RideRepositoryInterface} from "./RideRepositoryInterface";
import Ride from "../../domain/entity/Ride";

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

    async findRidesFromPassenger(passengerId: string, status: string[], hasStatus: boolean): Promise<Ride[]> {
        return this.rides.filter(r => r.passengerId === passengerId && status.filter(s => hasStatus ? (s === r.getStatus()) : (s !== r.getStatus())));
    }

    async findRidesFromDriver(driverId: string, status: string[], hasStatus: boolean): Promise<Ride[]> {
        return this.rides.filter(r => r.getDriverId() === driverId && status.filter(s => hasStatus ? (s === r.getStatus()) : (s !== r.getStatus())));
    }

    async listRides(): Promise<Ride[]> {
        return this.rides;
    }
}
