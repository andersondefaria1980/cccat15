import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "./accountRepositoryInterface";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: AccountDto[] = [];

    public addAccount(accountDto: AccountDto) {
        this.accounts.push(accountDto);
    }

    public findAccount(accountId: string) {
        return this.accounts.find(a => a.getAccountId() === accountId);
    }
    
    findAccountByEmail(email: string) {
        return this.accounts.find(a => a.getEmail() === email);
    }    

    public listAccounts() {
        return this.accounts;
    }

    public deleteAccount(accountId: string) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.getAccountId() === accountId;
        });                
        if (indexOfObject !== -1) {
            this.accounts.splice(indexOfObject, 1);
        }                
    }

    public updateAccount(accountDto: AccountDto) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.getAccountId() === accountDto.getAccountId();
        }); 
        if (indexOfObject !== -1) {
            this.accounts[indexOfObject] = accountDto;
        }    
    }
}
