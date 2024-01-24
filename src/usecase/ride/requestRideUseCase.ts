import {RideRepositoryInterface} from "../../repository/ride/rideRepositoryInterface";
import RideDtoRequest from "../../domain/rideDtoRequest";
import crypto from "crypto";
import RideDto from "../../domain/rideDto";
import {AccountRepositoryInterface} from "../../repository/account/accountRepositoryInterface";

export default class RequestRideUseCase {
    public readonly STATUS_REQUESTED = "REQUESTED";

    constructor(
        readonly rideRepository: RideRepositoryInterface,
        readonly acountRepository: AccountRepositoryInterface
    ) {}

    public async execute(requestRideDto: RideDtoRequest) {
        const rideId = crypto.randomUUID();
        const rideDto = new RideDto(rideId, requestRideDto.passengetId, null, this.STATUS_REQUESTED, 50, 10, requestRideDto.from, requestRideDto.to, Date.now());
        await this.rideRepository.addRide(rideDto)
        return rideId;
    }
}