import { AccountRepositoryInterface } from "../../../repository/account/AccountRepositoryInterface";
import AccountOutput from "./inputOutputData/AccountOutput";

export default class ListAccountsUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(): Promise<AccountOutput[]> {
        const accountList = await this.accountRepository.listAccounts();
        return accountList.map(a => AccountOutput.create(a));
    }
}
