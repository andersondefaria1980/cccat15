import AccountDTO from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import SignupUseCase from "../../../src/usecase/account/signupUseCase";

let accountRepository: AccountRepositoryInMemory;
let signupUseCase: SignupUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    signupUseCase = new SignupUseCase(accountRepository);
});

test("Must create an account: ", async function() {
    const accountDTO = new AccountDTO(null, "Jose da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    const createdAccountId = await signupUseCase.execute(accountDTO);    
    const returnedAccountDTO = await accountRepository.findAccount(createdAccountId);
    
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

test("Must return error if email already exists", async function() {
    const accountDto = new AccountDTO('aaa', "José da Silva", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDto);
    signupUseCase = new SignupUseCase(accountRepository);
    const accountDtoToSignup = new AccountDTO(null, "Joao Silveira", "jose@tests.com", "04780028078", "AAA 5589", "698523", false, true);
    await expect(() => signupUseCase.execute(accountDtoToSignup)).rejects.toThrow(new Error("Email has already been taken."));
});

test.each([
    {field: 'Name', accountDto: new AccountDTO(null, "Ad a", "jose@tests.com", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'Email', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests", "04780028078", "AAA 1234", "123456", false, true)},
    {field: 'CPF', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests.com", "12345678911", "AAA 1234", "123456", false, true)},
    {field: 'Car plate', accountDto: new AccountDTO(null, "Jose da silva", "jose@tests.com", "04780028078", "CCCCCCCC", "123456", false, true)}
])("Must return error if field is invalid: %s", async function(object: {field:string, accountDto: AccountDTO}) {
    await expect(() => signupUseCase.execute(object.accountDto)).rejects.toThrow(new Error(`${object.field} is invalid.`));
});
