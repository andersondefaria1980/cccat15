import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "./accountRepositoryInterface";
import { db } from "../../infra/database";

export default class AccountRepositoryDatabase implements AccountRepositoryInterface {
    private accounts: AccountDto[] = [];        

    public async addAccount(accountDto: AccountDto) {
        await db.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
            [accountDto.getAccountId(), accountDto.getName(), accountDto.getEmail(), accountDto.getCpf(), accountDto.getCarPlate(), accountDto.getIsPassenger(), accountDto.getIsDriver()]);
    }

    public async findAccount(accountId: string) {        
        const accountDbList = await db.any("select * from cccat15.account where account_id = $1", accountId);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver);
        }
        return undefined;
    }
    
    public async findAccountByEmail(email: string) {
        const accountDbList = await db.any("select * from cccat15.account where email = $1", email);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver);
        }
        return undefined;
    }    

    public async listAccounts() {
        const accountDbList = await db.any("select * from cccat15.account order by name");        
        let accountDtoList: AccountDto[] = [];
        accountDbList.forEach((accountDb) => accountDtoList.push(new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver)));
        return accountDtoList;
    }

    public async deleteAccount(accountId: string) {
        await db.any("delete from cccat15.account where account_id = $1", accountId );
    }

    public async updateAccount(accountDto: AccountDto) {
        await db.query("update cccat15.account  set name = $1, email = $2, cpf = $3, car_plate = $4, is_passenger = $5, is_driver = $6 where account_id = $7",
            [accountDto.getName(), accountDto.getEmail(), accountDto.getCpf(), accountDto.getCarPlate(), accountDto.getIsPassenger(), accountDto.getIsDriver(), accountDto.getAccountId()]);
    }
}
