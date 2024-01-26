import AccountDto from "../../../src/domain/AccountDto";
import RideValues from "../../../src/domain/RideValues";
import CoordinateDto from "../../../src/domain/CoordinateDto";
import crypto from "crypto";
import RideDto from "../../../src/domain/RideDto";
import {AccountRepositoryInterface} from "../../../src/repository/account/AccountRepositoryInterface";
import AccountDTO from "../../../src/domain/AccountDto";
import {RideRepositoryInterface} from "../../../src/repository/ride/RideRepositoryInterface";

export default class RideTestUtils {

    public async createRide(
        rideRepository: RideRepositoryInterface,
        passengerAccountDto: AccountDto,
        status: string = RideValues.STATUS_REQUESTED,
        driverAccount?: AccountDto
    ): Promise<string> {
        const from = new CoordinateDto(1,2);
        const to = new CoordinateDto(5,6);
        const rideId = crypto.randomUUID();
        const driverAccountDto = driverAccount ? driverAccount : null;
        const rideDto = new RideDto(rideId, passengerAccountDto, driverAccountDto, status, 0, 0, from, to, Date.now());
        await rideRepository.addRide(rideDto);
        return rideId;
    }

    public async createAccount(
        accountRepository: AccountRepositoryInterface,
        isPassenger: boolean,
        isDriver: boolean
    ): Promise<AccountDto> {
        const accountId = crypto.randomUUID();
        const accountDto = new AccountDTO(accountId, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", isPassenger, isDriver);
        await accountRepository.addAccount(accountDto);
        return accountDto;
    }
}
