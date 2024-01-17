//import { signup } from "../src/usecase/signup.ts";

import AccountDTO from "../src/domain/accountDto";
import AccountRepositoryInMemory from "../src/repository/accountRepositoryInMemory";
import GetAccountUseCase from "../src/usecase/getAccountUseCase";
import SignupUseCase from "../src/usecase/signupUseCase";

test("Must create an account: ", function() {
    let accountRepository = new AccountRepositoryInMemory;
    const signupUseCase = new SignupUseCase(accountRepository);
    const accountDTO = new AccountDTO(null, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);
    
    const createdAccountId = signupUseCase.execute(accountDTO);
    const getAccountUseCase = new GetAccountUseCase(accountRepository);
    const returnedAccountDTO = getAccountUseCase.execute(createdAccountId);
    
    expect(returnedAccountDTO).toBeInstanceOf(AccountDTO);
    expect(typeof returnedAccountDTO?.getAccountId()).toBe("string");
    expect(returnedAccountDTO?.getName()).toBe(accountDTO.getName());
    expect(returnedAccountDTO?.getEmail()).toBe(accountDTO.getEmail());
    expect(returnedAccountDTO?.getCpf()).toBe(accountDTO.getCpf());
    expect(returnedAccountDTO?.getCarPlate()).toBe(accountDTO.getCarPlate());
    expect(returnedAccountDTO?.getPassword()).toBe(accountDTO.getPassword());
    expect(returnedAccountDTO?.getIsPassenger()).toBe(accountDTO.getIsPassenger());
    expect(returnedAccountDTO?.getIsDriver()).toBe(accountDTO.getIsDriver());
    
});