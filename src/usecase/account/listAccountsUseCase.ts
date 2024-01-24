import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class ListAccountsUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute() {
        return await this.accountRepository.listAccounts();
    }
}
