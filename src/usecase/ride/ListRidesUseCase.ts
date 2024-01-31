import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import RideOutput from "./inputOutputData/RideOutput";

export default class ListRidesUseCase {
    public constructor(readonly rideRepository: RideRepositoryInterface) {}

    public async execute(): Promise<RideOutput[]> {
        const rides = await this.rideRepository.listRides();
        return rides.map((r) => RideOutput.create(r));
    }
}
