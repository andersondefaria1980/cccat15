import { AccountRepositoryInterface } from "../../repository/account/accountRepositoryInterface";

export default class DeleteAccountUseCase {
    public constructor(private accountRepository: AccountRepositoryInterface) {}

    public async execute(accountId: string) {
        const account = await this.accountRepository.findAccount(accountId);
        if (!account) {
            throw Error("Account doesn't exists");
        }
        await this.accountRepository.deleteAccount(accountId);
    }
}