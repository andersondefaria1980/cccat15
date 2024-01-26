import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";

export default class ListRidesUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute() {
        return await this.rideRepository.listRides();
    }
}
