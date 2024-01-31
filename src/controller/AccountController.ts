import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/AccountRepositoryDatabase';
import GetAccountUseCase from '../usecase/account/GetAccountUseCase';
import ListAccountsUseCase from '../usecase/account/ListAccountsUseCase';
import AccountInput from '../usecase/account/inputOutputData/AccountInput';
import SignupUseCase from '../usecase/account/SignupUseCase';
import UpdateAccountUseCase from '../usecase/account/UpdateAccountUseCase';
import DeleteAccountUseCase from '../usecase/account/DeleteAccountUseCase';

export default class AccountController {
    private accountRepository: AccountRepositoryDatabase;

    public constructor() {
        this.accountRepository = new AccountRepositoryDatabase();
    }

    public async listAccounts(params: any, body: any) {
        const listAccountsUseCase = new ListAccountsUseCase(this.accountRepository);
        return await listAccountsUseCase.execute();
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

    public async deleteAccount(params: any) {
        const accountId = params.id;
        const deleteAccountUseCase = new DeleteAccountUseCase(this.accountRepository);
        await deleteAccountUseCase.execute(accountId);
    }

    public async updateAccount(body: any) {
        const accountInput = AccountInput.create(body.name, body.email, body.cpf, body.isPassenger, body.isDriver, body.carPlate);
        const accountId = body.accountId;
        const updateAccountUseCase = new UpdateAccountUseCase(this.accountRepository);
        await updateAccountUseCase.execute(accountId, accountInput);
    }
}
