import AccountRepositoryDatabase from '../repository/account/AccountRepositoryDatabase';
import RideRepositoryDatabase from "../repository/ride/RideRepositoryDatabase";
import ListRidesUseCase from "../usecase/ride/ListRidesUseCase";
import GetRideUseCase from "../usecase/ride/GetRideUseCase";
import RequestRideUseCase from "../usecase/ride/RequestRideUseCase";
import DeleteRideUseCase from "../usecase/ride/DeleteRideUseCase";
import AcceptRideUseCase from "../usecase/ride/AcceptRideUseCase";
import StartRideUseCase from "../usecase/ride/StartRideUseCase";
import RideInput from "../usecase/ride/inputOutputData/RideInput";
import RideOutput from "../usecase/ride/inputOutputData/RideOutput";

export default class RideController {
    private rideRepository: RideRepositoryDatabase;
    private accountRepository: AccountRepositoryDatabase;

    public constructor() {
        this.rideRepository = new RideRepositoryDatabase();
        this.accountRepository = new AccountRepositoryDatabase();
    }

    public async listRides(params: any): Promise<RideOutput[]> {
        const listRides = new ListRidesUseCase(this.rideRepository);
        return await listRides.execute();
    }

    public async getRide(params: any): Promise<RideOutput> {
        const rideId = params.id;
        const getRideUseCase = new GetRideUseCase(this.rideRepository);
        const ride = await getRideUseCase.execute(rideId);
        if(!ride) throw new Error("Ride not found");
        return ride;
    }

    public async requestRide(body: any) {
        const rideInput = RideInput.create(body.passengerId, body.from.latitude, body.from.longitude, body.to.latitude, body.to.longitude);
        const requestRideUseCase = new RequestRideUseCase(this.rideRepository, this.accountRepository);
        return await requestRideUseCase.execute(rideInput);
    }

    public async deleteRide(params: any): Promise<void> {
        const rideId = params.id;
        const deleteRideUseCase = new DeleteRideUseCase(this.rideRepository);
        await deleteRideUseCase.execute(rideId);
    }

    public async acceptRide(body: any): Promise<void> {
        const rideId = body.rideId;
        const driverId = body.driverId;
        const acceptRideUseCase = new AcceptRideUseCase(this.rideRepository, this.accountRepository);
        await acceptRideUseCase.execute(rideId, driverId);
    }

    public async startRide(body: any): Promise<void> {
        const rideId = body.rideId;
        const startRideUseCase = new StartRideUseCase(this.rideRepository);
        await startRideUseCase.execute(rideId);
    }

}
