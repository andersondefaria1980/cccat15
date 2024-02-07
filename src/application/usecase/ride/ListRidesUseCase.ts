import {RideRepositoryInterface} from "../../../repository/ride/RideRepositoryInterface";
import RideOutput from "./inputOutputData/RideOutput";
import {AccountRepositoryInterface} from "../../../repository/account/AccountRepositoryInterface";

export default class ListRidesUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface,
    ) {}

    public async execute(): Promise<RideOutput[]> {
        const rides = await this.rideRepository.listRides();
        const ridesList: RideOutput[] = [];
        for (const ride of rides) {
            const passenger = await this.accountRepository.findAccount(ride.passengerId);
            let driver = undefined;
            const driverId = ride.getDriverId();
            if (driverId) driver = await this.accountRepository.findAccount(driverId);
            ridesList.push(RideOutput.create(ride, passenger, driver));
        }
        return ridesList;
    }
}
