import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class GetAccountUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {        
    }

    public execute(accountId: string): AccountDto|undefined {
        return this.accountRepository.findAccount(accountId);        
    }
}
