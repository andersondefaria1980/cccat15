import RideDto from "../../domain/rideDto";

export interface RideRepositoryInterface {
    addRide(rideDto: RideDto): Promise<void>;
    findRidesFromPassenger(passengerId: string, status?: string[], hasStatus?: boolean): Promise<RideDto[]>;
    findRide(rideId: string): Promise<RideDto|undefined>;
    updateRide(rideDto: RideDto): Promise<void>;
}
