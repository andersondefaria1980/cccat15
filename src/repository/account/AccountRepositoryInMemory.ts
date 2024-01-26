import AccountDto from "../../domain/AccountDto";
import { AccountRepositoryInterface } from "./AccountRepositoryInterface";

export default class AccountRepositoryInMemory implements AccountRepositoryInterface {
    private accounts: AccountDto[] = [];

    public async addAccount(accountDto: AccountDto) {
        this.accounts.push(accountDto);
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

    public async updateAccount(accountDto: AccountDto) {
        const indexOfObject = this.accounts.findIndex((a) => {
            return a.accountId === accountDto.accountId;
        }); 
        if (indexOfObject !== -1) {
            this.accounts[indexOfObject] = accountDto;
        }    
    }
}
