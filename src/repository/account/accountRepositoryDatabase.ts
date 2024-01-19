import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "./accountRepositoryInterface";
import { db } from "../../infra/database";

export default class AccountRepositoryDatabase implements AccountRepositoryInterface {    
    private accounts: AccountDto[] = [];        

    public async addAccount(accountDto: AccountDto) {
        await db.query(`insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ('${accountDto.getAccountId()}', '${accountDto.getName()}', '${accountDto.getEmail()}', '${accountDto.getCpf()}', '${accountDto.getCarPlate()}', ${accountDto.getIsPassenger()}, ${accountDto.getIsDriver()});`)
    }

    public async findAccount(accountId: string) {        
        const accountDbList = await db.any("select * from cccat15.account where account_id = '" + accountId + "'");        
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver);
        }
        return undefined;
    }
    
    public async findAccountByEmail(email: string) {
        const accountDbList = await db.any("select * from cccat15.account where email = '" + email + "'");        
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver);
        }
        return undefined;
    }    

    public async listAccounts() {
        const accountDbList = await db.any("select * from cccat15.account");        
        let accountDtoList: AccountDto[] = [];
        accountDbList.forEach((accountDb) => accountDtoList.push(new AccountDto(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.car_plate, "pass", accountDb.is_passenger, accountDb.is_driver)));
        return accountDtoList;
    }
}
