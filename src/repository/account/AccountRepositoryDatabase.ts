import { AccountRepositoryInterface } from "./AccountRepositoryInterface";
import { db } from "../../infra/database/database";
import Account from "../../domain/Account";

export default class AccountRepositoryDatabase implements AccountRepositoryInterface {

    public async addAccount(account: Account) {
        await db.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
            [account.accountId, account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver]);
    }

    public async findAccount(accountId: string) {
        const accountDbList = await db.any("select * from cccat15.account where account_id = $1", accountId);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf,  accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate);
        }
        return undefined;
    }
    
    public async findAccountByEmail(email: string) {
        const accountDbList = await db.any("select * from cccat15.account where email = $1", email);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf,  accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate);
        }
        return undefined;
    }    

    public async listAccounts() {
        const accountDbList = await db.any("select * from cccat15.account order by name");        
        let accountList: Account[] = [];
        accountDbList.forEach((accountDb) => accountList.push(Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf,  accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate)));
        return accountList;
    }

    public async deleteAccount(accountId: string) {
        await db.any("delete from cccat15.account where account_id = $1", accountId );
    }

    public async updateAccount(account: Account) {
        await db.query("update cccat15.account  set name = $1, email = $2, cpf = $3, car_plate = $4, is_passenger = $5, is_driver = $6 where account_id = $7",
            [account.name, account.email, account.cpf, account.carPlate, account.isPassenger, account.isDriver, account.accountId]);
    }
}
