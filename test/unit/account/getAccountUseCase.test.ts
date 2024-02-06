import crypto from "crypto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import GetAccountUseCase from "../../../src/usecase/account/GetAccountUseCase";
import Account from "../../../src/domain/Account";
import AccountOutput from "../../../src/usecase/account/inputOutputData/AccountOutput";

let accountRepository: AccountRepositoryInMemory;
let getAccountUseCase: GetAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    getAccountUseCase = new GetAccountUseCase(accountRepository);
});

test("Must return an account", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "02976067945",  false, true, "AAA 1234");
    await accountRepository.addAccount(account);
    getAccountUseCase = new GetAccountUseCase(accountRepository);
    const returnedAccount = await getAccountUseCase.execute(account.accountId);
    expect(returnedAccount).toBeInstanceOf(AccountOutput);
    expect(returnedAccount?.accountId).toBe(account.accountId);
    expect(returnedAccount?.name).toBe(account.name);
    expect(returnedAccount?.email).toBe(account.email);
    expect(returnedAccount?.cpf).toBe(account.cpf);
    expect(returnedAccount?.carPlate).toBe(account.carPlate);
    expect(returnedAccount?.isPassenger).toBe(account.isPassenger);
    expect(returnedAccount?.isDriver).toBe(account.isDriver);
});

describe("Must not find account", () => {
    it("Must return undefined if id doesn't exist", async () => {
        const anotherID = crypto.randomUUID();
        const returnedAccount = await getAccountUseCase.execute(anotherID);
        expect(returnedAccount).toBeUndefined();
    });
    it("Must return undefined if id is not valid", async () => {
        const invalidId: string = "AAA";
        const returnedAccount = await getAccountUseCase.execute(invalidId);
        expect(returnedAccount).toBeUndefined();
    });
});
