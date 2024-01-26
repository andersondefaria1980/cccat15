import {RideRepositoryInterface} from "./rideRepositoryInterface";
import RideDto from "../../domain/rideDto";
import {db} from "../../infra/database";
import AccountDto from "../../domain/accountDto";
import CoordinateDto from "../../domain/coordinateDto";

export default class RideRepositoryDatabase implements RideRepositoryInterface {

    async addRide(rideDto: RideDto): Promise<void> {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await db.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [rideDto.rideId, rideDto.passenger.accountId, rideDto.driver?.accountId, rideDto.status, rideDto.fare, rideDto.distance, rideDto.from.latitude, rideDto.from.longitude, rideDto.to.latitude, rideDto.to.longitude, date]);
    }

    async findRide(rideId: string) {
        const rideDbList = await db.any("select r.ride_id, r.status, r.fare, r.distance, r.from_lat, r.from_long, r.to_lat, r.to_long, r.date,\n" +
            "       p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, p.cpf as passenger_cpf, p.car_plate as passenger_car_plate, p.is_passenger as passenger_is_passenger, p.is_driver as passenger_is_driver,\n" +
            "       d.account_id as driver_id, d.name as driver_name, d.email as driver_email, d.cpf as driver_cpf, d.car_plate as driver_car_plate, d.is_passenger as driver_is_passenger, d.is_driver as driver_is_driver\n" +
            "from cccat15.ride r\n" +
            "    inner join cccat15.account p on p.account_id = r.passenger_id\n" +
            "    left join cccat15.account d on d.account_id = r.driver_id\n" +
            `where r.ride_id = $1`, rideId);
        if (rideDbList.length > 0) {
            const rideDb = rideDbList[0]
            return this.getRideFromDb(rideDb);
        }
        return undefined;
    }

    findRidesFromDriver(driverId: string, status?: string[], hasStatus?: boolean): Promise<RideDto[]> {
        return Promise.resolve([]);
    }

    findRidesFromPassenger(passengerId: string, status?: string[], hasStatus?: boolean): Promise<RideDto[]> {
        return Promise.resolve([]);
    }

    async updateRide(rideDto: RideDto): Promise<void> {
        await db.query("update cccat15.ride  set passenger_id = $1, driver_id = $2, status = $3, fare = $4, distance = $5, from_lat = $6, from_long = $7, to_lat = $8, to_long = $9 where ride_id = $10",
            [rideDto.passenger.accountId, rideDto.driver?.accountId, rideDto.status, rideDto.fare, rideDto.distance, rideDto.from.latitude, rideDto.from.longitude, rideDto.to.latitude, rideDto.to.longitude, rideDto.rideId]);
    }

    public async deleteRide(rideId: string) {
        await db.any("delete from cccat15.ride where ride_id = $1", rideId );
    }

    async listRides(): Promise<RideDto[]> {
        const rideDbList = await db.any("select r.ride_id, r.status, r.fare, r.distance, r.from_lat, r.from_long, r.to_lat, r.to_long, r.date,\n" +
            "       p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, p.cpf as passenger_cpf, p.car_plate as passenger_car_plate, p.is_passenger as passenger_is_passenger, p.is_driver as passenger_is_driver,\n" +
            "       d.account_id as driver_id, d.name as driver_name, d.email as driver_email, d.cpf as driver_cpf, d.car_plate as driver_car_plate, d.is_passenger as driver_is_passenger, d.is_driver as driver_is_driver\n" +
            "from cccat15.ride r\n" +
            "    inner join cccat15.account p on p.account_id = r.passenger_id\n" +
            "    left join cccat15.account d on d.account_id = r.driver_id\n" +
            "order by ride_id desc");
        let rideDtoList: RideDto[] = [];
        rideDbList.forEach((rideDb) => {
            rideDtoList.push(this.getRideFromDb(rideDb));
        });
        return rideDtoList;
    }

    private getRideFromDb(rideDb: any): RideDto {
        const from = new CoordinateDto(+rideDb.from_lat, +rideDb.from_long);
        const to = new CoordinateDto(+rideDb.to_lat, +rideDb.to_long);
        const passenger = new AccountDto(rideDb.passenger_id, rideDb.passenger_name, rideDb.passenger_email, rideDb.passenger_cpf, rideDb.passenger_car_plate, "pass", rideDb.passenger_is_passenger, rideDb.passenger_is_driver);
        let driver = null;
        if (rideDb.driver_id) {
            driver = new AccountDto(rideDb.driver_id, rideDb.driver_name, rideDb.driver_email, rideDb.driver_cpf, rideDb.driver_car_plate, "pass", rideDb.driver_is_passenger, rideDb.driver_is_driver);
        }
        return new RideDto(rideDb.ride_id, passenger, driver, rideDb.status, +rideDb.fare, +rideDb.distance, from, to, rideDb.date);
    }

}
