import AccountDto from "../domain/accountDto";
import { AccountRepositoryInterface } from "./accountRepositoryInterface";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: AccountDto[] = [];

    public addAccount(accountDto: AccountDto): void {
        this.accounts.push(accountDto);
    }
    public findAccount(accountId: string): AccountDto|undefined {
        return this.accounts.find(a => a.getAccountId() === accountId);
    }    
}
