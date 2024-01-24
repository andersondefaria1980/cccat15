import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class DeleteAccountUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(accountId: string) {       
        const account = await this.accountRepository.findAccount(accountId);
        if (!account) {
            throw Error("Account not found.");
        }
        await this.accountRepository.deleteAccount(accountId);
    }
}