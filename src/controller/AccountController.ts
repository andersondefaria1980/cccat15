import AccountRepositoryDatabase from '../repository/account/AccountRepositoryDatabase';
import GetAccountUseCase from '../application/usecase/account/GetAccountUseCase';
import AccountInput from '../application/usecase/account/inputOutputData/AccountInput';
import SignupUseCase from '../application/usecase/account/SignupUseCase';

export default class AccountController {
    private accountRepository: AccountRepositoryDatabase;

    public constructor() {
        this.accountRepository = new AccountRepositoryDatabase();
    }

    public async getAccount(params: any) {
        const accountId = params.id;
        const getAccountUseCase = new GetAccountUseCase(this.accountRepository);
        const accountOutput= await getAccountUseCase.execute(accountId);
        if (!accountOutput) throw new Error("Account not found");
        return accountOutput;
    }

    public async signup(body: any) {
        const accountInput = AccountInput.create(body.name, body.email, body.cpf, body.isPassenger, body.isDriver, body.carPlate);
        const signupUseCase = new SignupUseCase(this.accountRepository);
        return await signupUseCase.execute(accountInput);
    }
}
