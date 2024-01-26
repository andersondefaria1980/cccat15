import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/AccountRepositoryDatabase';
import GetAccountUseCase from '../usecase/account/GetAccountUseCase';
import ListAccountsUseCase from '../usecase/account/ListAccountsUseCase';
import AccountDto from '../domain/AccountDto';
import SignupUseCase from '../usecase/account/SignupUseCase';
import UpdateAccountUseCase from '../usecase/account/UpdateAccountUseCase';
import DeleteAccountUseCase from '../usecase/account/DeleteAccountUseCase';

export default class AccountController {
    private accountRepository: AccountRepositoryDatabase;

    public constructor() {
        this.accountRepository = new AccountRepositoryDatabase();
    }

    public async getAccounts(req: Request, res: Response) {
        const listAccountsUseCase = new ListAccountsUseCase(this.accountRepository);
        const accounts = await listAccountsUseCase.execute()
            .catch((e: Error) => {
                res.status(500).json({
                    msg: "Erro: " + e.message
                });
            });
        let accountsApi: any = [];
        if (accounts) {
            accountsApi = accounts.map((a) => a.toApi());
        }
        return res.status(200).json(accountsApi);
    }

    public async getAccount(req: Request, res: Response) {
        const accountId = req.params.id;
        const getAccountUseCase = new GetAccountUseCase(this.accountRepository);
        const account = await getAccountUseCase.execute(accountId);
        if (account) {
            res.status(200).json(account.toApi());
        } else {
            res.status(404).json({
                "msg": "Account not found"
            });
        }
    }

    public async addAccount(req: Request, res: Response) {
        const body = req.body;
        const accountDto = new AccountDto(null, body.name, body.email, body.cpf, body.carPlate, body.password, body.isPassenger, body.isDriver);
        const signupUseCase = new SignupUseCase(this.accountRepository);

        try {
            const accountId = await signupUseCase.execute(accountDto);
            res.status(201).json({
                msg: "Success: Account is created",
                accountId: accountId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

    public async deleteAccount(req: Request, res: Response) {
        const accountId = req.params.id;
        const deleteAccountUseCase = new DeleteAccountUseCase(this.accountRepository);

        try {
            await deleteAccountUseCase.execute(accountId);
            res.status(200).json({
                msg: "Success: Account deleted",
                accountId: accountId,
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }

    public async updateAccount(req: Request, res: Response) {
        const body = req.body;
        const accountDto = new AccountDto(body.accountId, body.name, body.email, body.cpf, body.carPlate, body.password, body.isPassenger, body.isDriver);
        const updateAccountUseCase = new UpdateAccountUseCase(this.accountRepository);

        try {
            await updateAccountUseCase.execute(accountDto);
            res.status(200).json({
                msg: "Success: Account is updated",
            });
        } catch (e) {
            res.status(400).json({
                msg: `${e}`,
            });
        }
    }
}