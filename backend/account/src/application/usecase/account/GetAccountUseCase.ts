import { AccountRepositoryInterface } from "../../../infra/repository/account/AccountRepositoryInterface";
import AccountOutput from "./inputOutputData/AccountOutput";

export default class GetAccountUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(accountId: string): Promise<AccountOutput|undefined> {
        const expression: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;	
	    if (!expression.test(accountId)) {
            return undefined;
        }        
        const account = await this.accountRepository.findAccount(accountId);
        return (!account) ? undefined : AccountOutput.create(account);
    }
}
