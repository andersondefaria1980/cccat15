import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import RideDtoRequest from "../../domain/RideDtoRequest";
import crypto from "crypto";
import RideDto from "../../domain/RideDto";
import {AccountRepositoryInterface} from "../../repository/account/AccountRepositoryInterface";
import RideValues from "../../domain/RideValues";

export default class RequestRideUseCase {
    constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly accountRepository: AccountRepositoryInterface
    ) {}

    public async execute(requestRideDto: RideDtoRequest) {
        const account = await this.accountRepository.findAccount(requestRideDto.passengerId);
        if (!account) throw new Error("Account not found.");
        if (!account.isPassenger) throw new Error("Account is not passenger.");

        const ridesNotCompleted = await this.rideRepository.findRidesFromPassenger(requestRideDto.passengerId, [RideValues.STATUS_COMPLETED], false);
        if (ridesNotCompleted.length > 0) throw new Error("Passenger has ride not completed.");

        const rideId = crypto.randomUUID();
        const rideDto = new RideDto(rideId, account, null, RideValues.STATUS_REQUESTED, 0, 0, requestRideDto.from, requestRideDto.to, Date.now());
        await this.rideRepository.addRide(rideDto)
        return rideId;
    }
}