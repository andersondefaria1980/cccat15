import Account from "../../domain/entity/Account";

export interface AccountRepositoryInterface {    
    addAccount(account: Account): Promise<void>;
    findAccount(accountId: string): Promise<Account|undefined>;
    findAccountByEmail(email: string): Promise<Account|undefined>;
    listAccounts(): Promise<Account[]>;
    deleteAccount(accountId: string): Promise<void>;
    updateAccount(account: Account): Promise<void>;
}
