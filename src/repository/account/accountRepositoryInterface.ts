import AccountDto from "../../domain/accountDto";

export interface AccountRepositoryInterface {    
    addAccount(accountDto: AccountDto): void;
    findAccount(accountId: string): any;
    findAccountByEmail(email: string): any;
    listAccounts(): any;
}
