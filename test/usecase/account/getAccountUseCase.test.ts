import crypto from "crypto";
import AccountDTO from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import GetAccountUseCase from "../../../src/usecase/account/getAccountUseCase";

test("Must return an account", function() {
    let accountRepository = new AccountRepositoryInMemory();
    const id = crypto.randomUUID();
    const accountDTO = new AccountDTO(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDTO);
    
    const getAccountUseCase = new GetAccountUseCase(accountRepository);    
    const returnedAccountDTO = getAccountUseCase.execute(id);
    
    expect(returnedAccountDTO).toBeInstanceOf(AccountDTO);
    expect(returnedAccountDTO?.getAccountId()).toBe(accountDTO.getAccountId());
    expect(returnedAccountDTO?.getName()).toBe(accountDTO.getName());
    expect(returnedAccountDTO?.getEmail()).toBe(accountDTO.getEmail());
    expect(returnedAccountDTO?.getCpf()).toBe(accountDTO.getCpf());
    expect(returnedAccountDTO?.getCarPlate()).toBe(accountDTO.getCarPlate());
    expect(returnedAccountDTO?.getPassword()).toBe(accountDTO.getPassword());
    expect(returnedAccountDTO?.getIsPassenger()).toBe(accountDTO.getIsPassenger());
    expect(returnedAccountDTO?.getIsDriver()).toBe(accountDTO.getIsDriver());
});

test("Must return error", function() {
    let accountRepository = new AccountRepositoryInMemory();
    const id = crypto.randomUUID();
    const accountDTO = new AccountDTO(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDTO);
        
    const getAccountUseCase = new GetAccountUseCase(accountRepository);    
    const returnedAccountDTO = accountRepository.findAccount('AAA');

    expect(returnedAccountDTO).toBeUndefined;    
});