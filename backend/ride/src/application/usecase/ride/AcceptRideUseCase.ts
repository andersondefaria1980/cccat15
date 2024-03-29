import {RideRepositoryInterface} from "../../../infra/repository/ride/RideRepositoryInterface";
import AccountGatewayInterface from "../../../infra/gateway/AccountGateway";

export default class AcceptRideUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountGateway: AccountGatewayInterface
    ) {}

    public async execute(rideId: string, driverId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found");
        const accountDriver = await this.accountGateway.findById(driverId);
        if (!accountDriver) throw new Error("Driver account not found.");
        if (accountDriver && !accountDriver.isDriver) throw new Error("Driver account is not set as a driver.");
        const accountDriverId = accountDriver.accountId ? accountDriver.accountId : "";
        const driveRidesNotCompleted = await this.rideRepository.findRidesNotCompletedFromDriver(accountDriverId);
        if (driveRidesNotCompleted.length > 0) throw new Error("Driver has another ride accepted or in progress.");
        ride.accept(driverId);
        await this.rideRepository.updateRide(ride);
    }
}
