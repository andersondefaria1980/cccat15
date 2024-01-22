import { Request, Response, NextFunction } from 'express';
import AccountRepositoryDatabase from '../repository/account/accountRepositoryDatabase';
import GetAccountUseCase from '../usecase/account/getAccountUseCase';
import ListAccountsUseCase from '../usecase/account/listAccountsUseCase';
import AccountDto from '../domain/accountDto';
import SignupUseCase from '../usecase/account/signupUseCase';
import UpdateAccountUseCase from '../usecase/account/updateAccountUseCase';

async function getAccounts(req: Request, res: Response, next: NextFunction) {
    const listAccountsUseCase = new ListAccountsUseCase(new AccountRepositoryDatabase());
    const accounts = await listAccountsUseCase.execute()
        .catch((e: Error) => {            
            res.status(500).json({
                msg: "Erro: " + e.message
            });
        });
    return res.status(200).json(accounts);
}

async function getAccount(req: Request, res: Response, next: NextFunction) {    
    const accountId = req.params.id;
    const getAccountUseCase = new GetAccountUseCase(new AccountRepositoryDatabase());
    const account = await getAccountUseCase.execute(accountId);

    if (account) {
        res.status(200).json(account);
    } else {
        res.status(404).json({
            "msg": "Account not found"
        });
    }
    
}

async function addAccount(req: Request, res: Response, next: NextFunction) {    
    const body = req.body;
    const accountDto = new AccountDto(null, body.name, body.email, body.cpf, body.carPlate, body.password, body.isPassenger, body.isDriver);
    const signupUseCase = new SignupUseCase(new AccountRepositoryDatabase());

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

async function deleteAccount(req: Request, res: Response, next: NextFunction) {    
    const accountId = req.params.id;
    const repository = new AccountRepositoryDatabase();
    await repository.deleteAccount(accountId);
    res.status(200).json({
        "msg": "Account deleted"
    });
}

async function updateAccount(req: Request, res: Response, next: NextFunction) {    
    const body = req.body;
    const accountDto = new AccountDto(body.accountId, body.name, body.email, body.cpf, body.carPlate, body.password, body.isPassenger, body.isDriver);
    const updateAccountUseCase = new UpdateAccountUseCase(new AccountRepositoryDatabase());
    
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

export default {
    getAccounts,
    getAccount,
    addAccount,
    deleteAccount,
    updateAccount,
}