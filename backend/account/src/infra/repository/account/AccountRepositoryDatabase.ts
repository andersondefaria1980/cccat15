import { AccountRepositoryInterface } from "./AccountRepositoryInterface";
import { db } from "../../database/database";
import Account from "../../../domain/entity/Account";

export default class AccountRepositoryDatabase implements AccountRepositoryInterface {

    public async addAccount(account: Account) {
        await db.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
            [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlte(), !!account.isPassenger, !!account.isDriver]);
    }

    public async findAccount(accountId: string) {
        const accountDbList = await db.any("select * from cccat15.account where account_id = $1", accountId);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.credit_card_token, accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate);
        }
        return undefined;
    }
    
    public async findAccountByEmail(email: string) {
        const accountDbList = await db.any("select * from cccat15.account where email = $1", email);
        if (accountDbList.length > 0) {
            const accountDb = accountDbList[0]
            return Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.credit_card_token, accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate);
        }
        return undefined;
    }    

    public async listAccounts() {
        const accountDbList = await db.any("select * from cccat15.account order by name");        
        let accountList: Account[] = [];
        accountDbList.forEach((accountDb) => accountList.push(Account.restore(accountDb.account_id, accountDb.name, accountDb.email, accountDb.cpf, accountDb.credit_card_token, accountDb.is_passenger, accountDb.is_driver, accountDb.car_plate)));
        return accountList;
    }
}
