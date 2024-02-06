import CoordinateDto from "../../../src/usecase/ride/inputOutputData/CoordinateDto";
import Ride from "../../../src/domain/Ride";
import {AccountRepositoryInterface} from "../../../src/repository/account/AccountRepositoryInterface";
import {RideRepositoryInterface} from "../../../src/repository/ride/RideRepositoryInterface";
import Account from "../../../src/domain/Account";

export default class RideTestUtils {

    public static async createRide(
        rideRepository: RideRepositoryInterface,
        passengerAccount: Account,
        status: string = Ride.STATUS_REQUESTED,
        driverAccountRide?: Account
    ): Promise<Ride> {
        const from = CoordinateDto.create(1,2);
        const to = CoordinateDto.create(5,6);
        const driverAccount = driverAccountRide ? driverAccountRide : null;
        const rideCreated = Ride.create(passengerAccount, from, to);
        const rideRestored = Ride.restore(rideCreated.rideId, passengerAccount, driverAccount, status, 0, 0, from, to, Date.now());
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
