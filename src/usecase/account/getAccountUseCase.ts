import AccountDto from "../../domain/accountDto";
import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class GetAccountUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(accountId: string): Promise<AccountDto|undefined> {
        const expression: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;	
	    if (!expression.test(accountId)) {
            return undefined;
        }        
        return await this.accountRepository.findAccount(accountId);
    }
}
