import express from "express";
import accountController from "../controller/accountController";

const accountRouter = express.Router();
accountRouter.get('/:id', accountController.getAccountById);

export default accountRouter;
