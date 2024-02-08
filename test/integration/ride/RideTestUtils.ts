import Ride from "../../../src/domain/entity/Ride";
import {AccountRepositoryInterface} from "../../../src/repository/account/AccountRepositoryInterface";
import {RideRepositoryInterface} from "../../../src/repository/ride/RideRepositoryInterface";
import Account from "../../../src/domain/entity/Account";

export default class RideTestUtils {

    public static async createRide(
        rideRepository: RideRepositoryInterface,
        passengerId: string,
        status: string = Ride.STATUS_REQUESTED,
        driverId?: string,
        fromLat?: number,
        fromLong?: number,
        toLat?: number,
        toLong?: number,
        lastLat?: number,
        lastLong?: number,
    ): Promise<Ride> {
        const rideCreated = Ride.create(passengerId, +fromLat,+fromLong,+toLat,+toLong);
        const rideRestored = Ride.restore(rideCreated.rideId, passengerId, status, 0, +fromLat, +fromLong, +toLat, +toLong, rideCreated.date, rideCreated.getLastLat(), rideCreated.getLastLong(),rideCreated.getDistance(), driverId);
        await rideRepository.addRide(rideRestored);
        return rideRestored;
    }

    public static async createAccount(
        accountRepository: AccountRepositoryInterface,
        isPassenger: boolean,
        isDriver: boolean
    ): Promise<Account> {
        const account = Account.create("Jose da Silva", "jose@tests.com", "04780028078", isPassenger, isDriver);
        await accountRepository.addAccount(account);
        return account;
    }
}
