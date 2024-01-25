import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";
import {AccountRepositoryInterface} from "../../repository/account/accountRepositoryInterface";
import RideDto from "../../domain/rideDto";
import RequestRideUseCase from "./requestRideUseCase";
import RideValues from "../../domain/rideValues";

export default class AcceptRideUseCase {
    public constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(rideId: string, driverId: string) {
        let ride = await this.rideRepository.findRide(rideId);
        if (!ride) throw new Error("Ride not found.");
        if (ride.status !== RideValues.STATUS_REQUESTED) throw new Error(`Ride has invalid status, ride stauts mus be ${RideValues.STATUS_REQUESTED}`);

        const accountDriver = await this.accountRepository.findAccount(driverId);
        if (!accountDriver) throw new Error("Driver account not found.");
        if (!accountDriver.isDriver) throw new Error("Driver account is not set as a driver.");

        ride.driver = accountDriver;
        ride.status = RideValues.STATUS_ACCEPTED;
        await this.rideRepository.updateRide(ride);
    }
}
