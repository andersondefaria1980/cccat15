import {AccountRepositoryInterface} from "../../../infra/repository/account/AccountRepositoryInterface";
import Account from "../../../domain/entity/Account";
import AccountInput from "./inputOutputData/AccountInput";
import MailerGateway from "../../../infra/gateway/MailerGateway";

export default class SignupUseCase {
    public constructor(
        readonly accountRepository: AccountRepositoryInterface,
        readonly mailerGateway: MailerGateway,
    ) {
    }

    public async execute(input: AccountInput) {
        const accountByEmail = await this.accountRepository.findAccountByEmail(input.email);
        if (accountByEmail) throw new Error("Email has already been taken.");
        const account = Account.create(input.name, input.email, input.cpf, input.creditCardToken, input.isPassenger, input.isDriver, input.carPlate);
        await this.accountRepository.addAccount(account);
        await this.mailerGateway.send("Welcome", account.getEmail(), "Use this link to confirm your account");
        return account.accountId;
    }
}
