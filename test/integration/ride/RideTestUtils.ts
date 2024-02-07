import Coordinate from "../../../src/application/usecase/ride/inputOutputData/Coordinate";
import Ride from "../../../src/domain/entity/Ride";
import {AccountRepositoryInterface} from "../../../src/repository/account/AccountRepositoryInterface";
import {RideRepositoryInterface} from "../../../src/repository/ride/RideRepositoryInterface";
import Account from "../../../src/domain/entity/Account";

export default class RideTestUtils {

    public static async createRide(
        rideRepository: RideRepositoryInterface,
        passengerId: string,
        status: string = Ride.STATUS_REQUESTED,
        driverId?: string
    ): Promise<Ride> {
        const from = Coordinate.create(1,2);
        const to = Coordinate.create(5,6);
        const driverAccount = driverId ? driverId : null;
        const rideCreated = Ride.create(passengerId, from, to);
        const rideRestored = Ride.restore(rideCreated.rideId, passengerId, status, 0, 0, from, to, Date.now(), driverId);
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
