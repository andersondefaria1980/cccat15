import {RideRepositoryInterface} from "./rideRepositoryInterface";
import RideDto from "../../domain/rideDto";

export default class RideRepositoryInMemory implements RideRepositoryInterface {
    private rides: RideDto[] = [];

    public async addRide(rideDto: RideDto) {
        this.rides.push(rideDto);
    }
}
