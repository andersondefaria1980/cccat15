import { AccountRepositoryInterface } from "./AccountRepositoryInterface";
import Account from "../../domain/entity/Account";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: Account[] = [];

    public async addAccount(account: Account) {
        this.accounts.push(account);
    }

    public async findAccount(accountId: string) {
        const account = this.accounts.find(a => a.accountId === accountId);
        return account ? Account.restore(account.accountId, account.getName(),account.getEmail(), account.getCpf(), account.isPassenger, account.isDriver, account.getCarPlte()) : undefined;
    }
    
    public async findAccountByEmail(email: string) {
        return this.accounts.find(a => a.getEmail() == email);
    }    

    public async listAccounts() {
        return this.accounts;
    }
}
