import crypto from "crypto";
import AccountRepositoryInMemory from "../../../src/infra/repository/account/AccountRepositoryInMemory";
import GetAccountUseCase from "../../../src/application/usecase/account/GetAccountUseCase";
import Account from "../../../src/domain/entity/Account";
import AccountOutput from "../../../src/application/usecase/account/inputOutputData/AccountOutput";

let accountRepository: AccountRepositoryInMemory;
let getAccountUseCase: GetAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    getAccountUseCase = new GetAccountUseCase(accountRepository);
});

test("Must return an account", async function() {
    const account = Account.create("Jose da Silva", "jose@tests.com", "02976067945",  "AAA", false, true, "AAA 1234");
    await accountRepository.addAccount(account);
    getAccountUseCase = new GetAccountUseCase(accountRepository);
    const returnedAccount = await getAccountUseCase.execute(account.accountId);
    expect(returnedAccount).toBeInstanceOf(AccountOutput);
    expect(returnedAccount?.accountId).toBe(account.accountId);
    expect(returnedAccount?.name).toBe(account.getName());
    expect(returnedAccount?.email).toBe(account.getEmail());
    expect(returnedAccount?.cpf).toBe(account.getCpf());
    expect(returnedAccount?.carPlate).toBe(account.getCarPlte());
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
