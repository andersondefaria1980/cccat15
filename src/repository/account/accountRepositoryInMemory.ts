import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "./accountRepositoryInterface";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: AccountDto[] = [];

    public async addAccount(accountDto: AccountDto) {
        this.accounts.push(accountDto);
    }

    public async findAccount(accountId: string) {
        return this.accounts.find(a => a.getAccountId() === accountId);
    }
    
    public async findAccountByEmail(email: string) {
        return this.accounts.find(a => a.getEmail() === email);
    }    

    public async listAccounts() {
        return this.accounts;
    }

    public async deleteAccount(accountId: string) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.getAccountId() === accountId;
        });                
        if (indexOfObject !== -1) {
            this.accounts.splice(indexOfObject, 1);
        }                
    }

    public async updateAccount(accountDto: AccountDto) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.getAccountId() === accountDto.getAccountId();
        }); 
        if (indexOfObject !== -1) {
            this.accounts[indexOfObject] = accountDto;
        }    
    }
}
