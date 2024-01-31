import AccountInput from "./inputOutputData/AccountInput";
import { AccountRepositoryInterface } from "../../repository/account/AccountRepositoryInterface";
import Account from "../../domain/Account";

export default class UpdateAccountUseCase {
    public constructor(readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(accountId: string, input: AccountInput) {
        const account = Account.restore(accountId, input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
        const accountByEmail = await this.accountRepository.findAccountByEmail(input.email);
        if (accountByEmail && accountByEmail.accountId !== accountId) throw new Error("Email has already been taken.");
        let accountDB = await this.accountRepository.findAccount(accountId);
        if (!accountDB) {
            throw Error(`Account [${accountId}] not found.`);
        }
        await this.accountRepository.updateAccount(account);
    }
}
