import { NextFunction, Request, Response } from "express";
import GetAccountUseCase from "../usecase/account/getAccountUseCase";
import AccountRepositoryInMemory from "../repository/account/accountRepositoryInMemory";

async function getAccountById(req: Request, res: Response, next: NextFunction) {
    const accountId = req.params.accountId;
    let getAccountUseCase = new GetAccountUseCase(new AccountRepositoryInMemory());
    return res.json(getAccountUseCase.execute(accountId));
}

export default {
    getAccountById
}

