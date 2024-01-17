import AccountDto from "../../domain/accountDto";

export interface AccountRepositoryInterface {    
    addAccount(accountDto: AccountDto): void;
    findAccount(accountId: string): AccountDto|undefined;
    findAccountByEmail(email: string): AccountDto|undefined;
}
