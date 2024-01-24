import {RideRepositoryInterface} from "./rideRepositoryInterface";
import RideDto from "../../domain/rideDto";

export default class RideRepositoryInMemory implements RideRepositoryInterface {
    private rides: RideDto[] = [];

    public async addRide(rideDto: RideDto) {
        this.rides.push(rideDto);
    }

    async findRidesFromPassenger(passengerId: string, status?: string[], hasStatus?: boolean): Promise<RideDto[]> {
        if (!status || status.length == 0) return this.rides.filter(r => r.passenger.accountId === passengerId);
        return this.rides.filter(r => r.passenger.accountId === passengerId && status.filter(s => hasStatus ? (s === r.status) : (s !== r.status)));
    }

    async findRide(rideId: string): Promise<RideDto | undefined> {
        return await this.rides.find(r => r.rideId === rideId);
    }

}
