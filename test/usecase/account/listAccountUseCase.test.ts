import AccountDto from "../../../src/domain/AccountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/AccountRepositoryInMemory";
import ListAccountsUseCase from "../../../src/usecase/account/ListAccountsUseCase";
import crypto from "crypto";

let accountRepository: AccountRepositoryInMemory;
let listAccountsUseCase: ListAccountsUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    listAccountsUseCase = new ListAccountsUseCase(accountRepository);
});

test("Must return a list of accounts", async function() {
    const id = crypto.randomUUID();
    const accountDTO = new AccountDto(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);    
    accountRepository.addAccount(accountDTO);
    accountRepository.addAccount(accountDTO);
    
    listAccountsUseCase = new ListAccountsUseCase(accountRepository);
    const accountList = await listAccountsUseCase.execute();
    expect(Array.isArray(accountList)).toBe(true);
    accountList.forEach((returnedAccountDTO: AccountDto) => {
        expect(returnedAccountDTO).toBeInstanceOf(AccountDto);        
    })    
});
