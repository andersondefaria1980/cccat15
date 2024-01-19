import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class GetAccountUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {}

    public execute(accountId: string): AccountDto|undefined {
        const expression: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;	
	    if (!expression.test(accountId)) {
            return undefined;
        }        
        return this.accountRepository.findAccount(accountId);        
    }
}
