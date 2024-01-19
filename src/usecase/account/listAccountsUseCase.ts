import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class ListAccountsUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {}

    public execute() {        
        return this.accountRepository.listAccounts();                
    }
}
