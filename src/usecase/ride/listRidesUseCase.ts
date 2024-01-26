import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";

export default class ListRidesUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute() {
        return await this.rideRepository.listRides();
    }
}
