import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/AccountRepositoryDatabase';
import RideRepositoryDatabase from "../repository/ride/RideRepositoryDatabase";
import ListRidesUseCase from "../usecase/ride/ListRidesUseCase";
import GetRideUseCase from "../usecase/ride/GetRideUseCase";
import RideDtoRequest from "../domain/RideDtoRequest";
import CoordinateDto from "../domain/CoordinateDto";
import RequestRideUseCase from "../usecase/ride/RequestRideUseCase";
import DeleteRideUseCase from "../usecase/ride/DeleteRideUseCase";
import AcceptRideUseCase from "../usecase/ride/AcceptRideUseCase";
import StartRideUseCase from "../usecase/ride/StartRideUseCase";

export default class RideController {
    private rideRepository: RideRepositoryDatabase;
    private accountRepository: AccountRepositoryDatabase;

    public constructor() {
        this.rideRepository = new RideRepositoryDatabase();
        this.accountRepository = new AccountRepositoryDatabase();
    }

    public async listRides(req: Request, res: Response) {
        const listRides = new ListRidesUseCase(this.rideRepository);
        const rides = await listRides.execute()
            .catch((e: Error) => {
                res.status(500).json({
                    msg: "Erro: " + e.message
                });
            });
        let ridesApi: any = [];
        if (rides) {
            ridesApi = rides.map((a) => a.toApi());
        }
        return res.status(200).json(ridesApi);
    }

    public async getRide(req: Request, res: Response) {
        const rideId = req.params.id;
        const getRideUseCase = new GetRideUseCase(this.rideRepository);
        const ride = await getRideUseCase.execute(rideId);
        if (ride) {
            res.status(200).json(ride.toApi());
        } else {
            res.status(404).json({
                "msg": "Ride not found."
            });
        }
    }

    public async requestRide(req: Request, res: Response) {
        const body = req.body;
        const from = new CoordinateDto(body.from.latitude, body.from.longitude);
        const to = new CoordinateDto(body.to.latitude, body.to.longitude);
        const rideDtoRequest = new RideDtoRequest(body.passengerId, from, to);
        const requestRideUseCase = new RequestRideUseCase(this.rideRepository, this.accountRepository);

        try {
            const rideId = await requestRideUseCase.execute(rideDtoRequest);
            res.status(201).json({
                msg: "Ride requested.",
                rideId: rideId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

    public async deleteRide(req: Request, res: Response) {
        const rideId = req.params.id;
        const deleteRideUseCase = new DeleteRideUseCase(this.rideRepository);

        try {
            await deleteRideUseCase.execute(rideId);
            res.status(200).json({
                msg: "Ride deleted.",
                accountId: rideId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

    public async acceptRide(req: Request, res: Response) {
        const rideId = req.body.rideId;
        const driverId = req.body.driverId;
        const acceptRideUseCase = new AcceptRideUseCase(this.rideRepository, this.accountRepository);

        try {
            await acceptRideUseCase.execute(rideId, driverId);
            res.status(200).json({
                msg: "Ride accepted.",
                accountId: rideId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

    public async startRide(req: Request, res: Response) {
        const rideId = req.body.rideId;
        const startRideUseCase = new StartRideUseCase(this.rideRepository);

        try {
            await startRideUseCase.execute(rideId);
            res.status(200).json({
                msg: "Ride started.",
                accountId: rideId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

}
