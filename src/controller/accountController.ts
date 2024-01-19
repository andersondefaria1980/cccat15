import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/accountRepositoryDatabase';
import GetAccountUseCase from '../usecase/account/getAccountUseCase';
import ListAccountsUseCase from '../usecase/account/listAccountsUseCase';

async function getAccounts(req: Request, res: Response, next: NextFunction) {
    const listAccountsUseCase = new ListAccountsUseCase(new AccountRepositoryDatabase());
    const accounts = await listAccountsUseCase.execute();    
    return res.status(200).json(accounts);
}

async function getAccount(req: Request, res: Response, next: NextFunction) {    
    const accountId = req.params.id;
    const getAccountUseCase = new GetAccountUseCase(new AccountRepositoryDatabase());
    const account = await getAccountUseCase.execute(accountId);

    if (account) {
        res.status(200).json(account);
    } else {
        res.sendStatus(404);
    }
    
}

async function addAccount(req: Request, res: Response, next: NextFunction) {
    console.log(req.params)    
    res.sendStatus(200);
}

export default {
    getAccounts,
    getAccount,
    addAccount
}