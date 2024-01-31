import { AccountRepositoryInterface } from "./AccountRepositoryInterface";
import Account from "../../domain/Account";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: Account[] = [];

    public async addAccount(account: Account) {
        this.accounts.push(account);
    }

    public async findAccount(accountId: string) {
        return this.accounts.find(a => a.accountId === accountId);
    }
    
    public async findAccountByEmail(email: string) {
        return this.accounts.find(a => a.email == email);
    }    

    public async listAccounts() {
        return this.accounts;
    }

    public async deleteAccount(accountId: string) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.accountId === accountId;
        });                
        if (indexOfObject !== -1) {
            this.accounts.splice(indexOfObject, 1);
        }                
    }

    public async updateAccount(account: Account) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.accountId === account.accountId;
        }); 
        if (indexOfObject !== -1) {
            this.accounts[indexOfObject] = account;
        }    
    }
}
