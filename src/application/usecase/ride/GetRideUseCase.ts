import {RideRepositoryInterface} from "../../../repository/ride/RideRepositoryInterface";
import RideOutput from "./inputOutputData/RideOutput";

export default class GetRideUseCase {
    public constructor(private rideRepository: RideRepositoryInterface) {}

    public async execute(rideId: string): Promise<RideOutput|undefined> {
        const expression: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!expression.test(rideId)) {
            return undefined;
        }
        const ride = await this.rideRepository.findRide(rideId);
        return (!ride) ? undefined : RideOutput.create(ride);
    }
}
