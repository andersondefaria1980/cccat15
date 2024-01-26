import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/accountRepositoryDatabase';
import RideRepositoryDatabase from "../repository/ride/rideRepositoryDatabase";
import ListRidesUseCase from "../usecase/ride/listRidesUseCase";
import GetRideUseCase from "../usecase/ride/gerRideUseCase";
import RideDtoRequest from "../domain/rideDtoRequest";
import CoordinateDto from "../domain/coordinateDto";
import RequestRideUseCase from "../usecase/ride/requestRideUseCase";

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
        const from = new CoordinateDto(body.from.lat, body.from.long);
        const to = new CoordinateDto(body.to.lat, body.to.long);
        const rideDtoRequest = new RideDtoRequest(body.passengerId, from, to);
        const requestRideUseCase = new RequestRideUseCase(this.rideRepository, this.accountRepository);

        try {
            const rideId = await requestRideUseCase.execute(rideDtoRequest);
            res.status(201).json({
                msg: "Success: Ride is created.",
                rideId: rideId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

}
