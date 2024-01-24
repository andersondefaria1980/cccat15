import RideDto from "../../domain/rideDto";

export interface RideRepositoryInterface {
    addRide(rideDto: RideDto): Promise<void>;
}
