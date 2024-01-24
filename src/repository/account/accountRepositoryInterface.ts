import AccountDto from "../../domain/accountDto";

export interface AccountRepositoryInterface {    
    addAccount(accountDto: AccountDto): Promise<void>;
    findAccount(accountId: string): Promise<AccountDto|undefined>;
    findAccountByEmail(email: string): Promise<AccountDto|undefined>;
    listAccounts(): Promise<AccountDto[]>;
    deleteAccount(accountId: string): Promise<void>;
    updateAccount(accountDto: AccountDto): Promise<void>;
}
