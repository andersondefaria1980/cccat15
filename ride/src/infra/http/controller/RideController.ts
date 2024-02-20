import RideRepositoryDatabase from "../../repository/ride/RideRepositoryDatabase";
import ListRidesUseCase from "../../../application/usecase/ride/ListRidesUseCase";
import GetRideUseCase from "../../../application/usecase/ride/GetRideUseCase";
import RequestRideUseCase from "../../../application/usecase/ride/RequestRideUseCase";
import AcceptRideUseCase from "../../../application/usecase/ride/AcceptRideUseCase";
import StartRideUseCase from "../../../application/usecase/ride/StartRideUseCase";
import RideInput from "../../../application/usecase/ride/inputOutputData/RideInput";
import RideOutput from "../../../application/usecase/ride/inputOutputData/RideOutput";
import PositionRepositoryDatabase from "../../repository/position/PositionRepositoryDatabase";
import UpdateRidePositionUseCase from "../../../application/usecase/ride/UpdateRidePositionUseCase";
import FinishRideUseCase from "../../../application/usecase/ride/FinishRideUseCase";
import PaymentGateway, {PaymentGatewayConsole} from "../../gateway/PaymentGateway";
import {PositionRepositoryInterface} from "../../repository/position/PositionRepositoryInterface";
import {RideRepositoryInterface} from "../../repository/ride/RideRepositoryInterface";
import {AccountGateway} from "../../gateway/AccountGateway";

export default class RideController {
    private rideRepository: RideRepositoryInterface;
    private positionRepository: PositionRepositoryInterface;
    private paymentGateway: PaymentGateway;
    private accountGateway: AccountGateway;

    public constructor() {
        this.rideRepository = new RideRepositoryDatabase();
        this.positionRepository = new PositionRepositoryDatabase();
        this.paymentGateway = new PaymentGatewayConsole();
        this.accountGateway = new AccountGateway();
    }

    public async listRides(params: any): Promise<RideOutput[]> {
        const listRides = new ListRidesUseCase(this.rideRepository, this.accountGateway);
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
        const requestRideUseCase = new RequestRideUseCase(this.rideRepository, this.accountGateway);
        return await requestRideUseCase.execute(rideInput);
    }

    public async acceptRide(body: any): Promise<void> {
        const rideId = body.rideId;
        const driverId = body.driverId;
        const acceptRideUseCase = new AcceptRideUseCase(this.rideRepository, this.accountGateway);
        await acceptRideUseCase.execute(rideId, driverId);
    }

    public async startRide(body: any): Promise<void> {
        const rideId = body.rideId;
        const startRideUseCase = new StartRideUseCase(this.rideRepository);
        await startRideUseCase.execute(rideId);
    }

    public async updatePosition(body: any): Promise<void> {
        const updatePositionRideUseCase = new UpdateRidePositionUseCase(this.positionRepository, this.rideRepository);
        await updatePositionRideUseCase.execute(body);
    }

    public async finishRide(body: any): Promise<void> {
        const rideId = body.rideId;
        const finishRideUseCase = new FinishRideUseCase(this.rideRepository, this.positionRepository, this.paymentGateway, this.accountGateway);
        await finishRideUseCase.execute(rideId);
    }
}
