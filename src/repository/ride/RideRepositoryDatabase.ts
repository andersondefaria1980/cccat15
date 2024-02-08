import {RideRepositoryInterface} from "./RideRepositoryInterface";
import Ride from "../../domain/entity/Ride";
import {db} from "../../infra/database/database";

export default class RideRepositoryDatabase implements RideRepositoryInterface {

    private static ACCOUNT_TYPE_PASSENGER = "passenger";
    private static ACCOUNT_TYPE_DRIVER = "driver";

    async addRide(ride: Ride): Promise<void> {
         const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
         await db.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date, last_lat, last_long) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
             [ride.rideId, ride.passengerId, ride.getDriverId(), ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), date, ride.getLastLat(), ride.getLastLong()]);
    }

    async findRide(rideId: string) {
        const rideDbList = await db.any("select r.ride_id, r.status, r.fare, r.distance, r.from_lat, r.from_long, r.to_lat, r.to_long, r.date,\n" +
            "       p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, p.cpf as passenger_cpf, p.car_plate as passenger_car_plate, p.is_passenger as passenger_is_passenger, p.is_driver as passenger_is_driver,\n" +
            "       d.account_id as driver_id, d.name as driver_name, d.email as driver_email, d.cpf as driver_cpf, d.car_plate as driver_car_plate, d.is_passenger as driver_is_passenger, d.is_driver as driver_is_driver,\n" +
            "       r.last_lat as last_lat, r.last_long as last_long\n" +
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

    async findRidesFromDriver(driverId: string, status?: string[], hasStatus?: boolean): Promise<Ride[]> {
        return await this.findRidesFromAccount(RideRepositoryDatabase.ACCOUNT_TYPE_DRIVER, driverId, status, hasStatus);
    }

    async findRidesFromPassenger(passengerId: string, status?: string[], hasStatus?: boolean): Promise<Ride[]> {
        return await this.findRidesFromAccount(RideRepositoryDatabase.ACCOUNT_TYPE_PASSENGER, passengerId, status, hasStatus);
    }

    async findRidesFromAccount(accountType: string, accountId: string, status?: string[], hasStatus?: boolean): Promise<Ride[]> {
        let sql = "select r.ride_id, r.status, r.fare, r.distance, r.from_lat, r.from_long, r.to_lat, r.to_long, r.date,\n" +
            "       p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, p.cpf as passenger_cpf, p.car_plate as passenger_car_plate, p.is_passenger as passenger_is_passenger, p.is_driver as passenger_is_driver,\n" +
            "       d.account_id as driver_id, d.name as driver_name, d.email as driver_email, d.cpf as driver_cpf, d.car_plate as driver_car_plate, d.is_passenger as driver_is_passenger, d.is_driver as driver_is_driver,\n" +
            "       r.last_lat as last_lat, r.last_long as last_long\n" +
            "from cccat15.ride r\n" +
            "    inner join cccat15.account p on p.account_id = r.passenger_id\n" +
            "    left join cccat15.account d on d.account_id = r.driver_id\n" +
            `where r.${accountType}_id = $1`;
        let parameters: any[] = [accountId];
        if (status) {
            const condition = hasStatus ? "IN" : "NOT IN";
            const statusIn = status.join("', '");
            sql += ` and status ${condition} ('${statusIn}')`;
        }
        const rideDbList = await db.any(sql, parameters);
        const rideDtoList: Ride[] = [];
        rideDbList.forEach((r) => {
            rideDtoList.push(this.getRideFromDb(r));
        });
        return rideDtoList;
    }

    async updateRide(ride: Ride): Promise<void> {
         await db.query("update cccat15.ride  set passenger_id = $1, driver_id = $2, status = $3, fare = $4, distance = $5, from_lat = $6, from_long = $7, to_lat = $8, to_long = $9 , last_lat = $10, last_long = $11 where ride_id = $12",
             [ride.passengerId, ride.getDriverId(), ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getLastLat(), ride.getLastLong(), ride.rideId]);
    }

    async listRides(): Promise<Ride[]> {
        const rideDbList = await db.any("select r.ride_id, r.status, r.fare, r.distance, r.from_lat, r.from_long, r.to_lat, r.to_long, r.date,\n" +
            "       p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, p.cpf as passenger_cpf, p.car_plate as passenger_car_plate, p.is_passenger as passenger_is_passenger, p.is_driver as passenger_is_driver,\n" +
            "       d.account_id as driver_id, d.name as driver_name, d.email as driver_email, d.cpf as driver_cpf, d.car_plate as driver_car_plate, d.is_passenger as driver_is_passenger, d.is_driver as driver_is_driver\n" +
            "from cccat15.ride r\n" +
            "    inner join cccat15.account p on p.account_id = r.passenger_id\n" +
            "    left join cccat15.account d on d.account_id = r.driver_id\n" +
            "order by ride_id desc");
        let rideList: Ride[] = [];
        rideDbList.forEach((rideDb) => {
            rideList.push(this.getRideFromDb(rideDb));
        });
        return rideList;
    }

    private getRideFromDb(rideDb: any): Ride {
        return Ride.restore(rideDb.ride_id, rideDb.passenger_id, rideDb.status, parseFloat(rideDb.fare), parseFloat(rideDb.from_lat), parseFloat(rideDb.from_long), parseFloat(rideDb.to_lat), parseFloat(rideDb.to_long), rideDb.date, parseFloat(rideDb.last_lat), parseFloat(rideDb.last_long), parseFloat(rideDb.distance), rideDb.driver_id);
    }
}
