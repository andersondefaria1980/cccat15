import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";
import RideOutput from "./inputOutputData/RideOutput";
import AccountGatewayInterface from "../../../infra/gateway/AccountGateway";

export default class ListRidesUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountGateway: AccountGatewayInterface,
    ) {}

    public async execute(): Promise<RideOutput[]> {
        const rides = await this.rideRepository.listRides();
        const ridesList: RideOutput[] = [];
        for (const ride of rides) {
            const passenger = await this.accountGateway.findById(ride.passengerId);
            let driver = undefined;
            const driverId = ride.getDriverId();
            if (driverId) driver = await this.accountGateway.findById(driverId);
            ridesList.push(RideOutput.create(ride, passenger?.name, driver?.name));
        }
        return ridesList;
    }
}
