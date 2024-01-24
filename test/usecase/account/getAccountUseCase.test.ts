import crypto from "crypto";
import AccountDto from "../../../src/domain/accountDto";
import AccountRepositoryInMemory from "../../../src/repository/account/accountRepositoryInMemory";
import GetAccountUseCase from "../../../src/usecase/account/getAccountUseCase";

let accountRepository: AccountRepositoryInMemory;
let getAccountUseCase: GetAccountUseCase;

beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory();
    getAccountUseCase = new GetAccountUseCase(accountRepository);
});

test("Must return an account", async function() {
    const id = crypto.randomUUID();
    const accountDTO = new AccountDto(id, "José da Silva", "jose@tests.com", "02563258741", "AAA 1234", "123456", false, true);
    accountRepository.addAccount(accountDTO);
    getAccountUseCase = new GetAccountUseCase(accountRepository);
    const returnedAccountDTO = await getAccountUseCase.execute(id);
    expect(returnedAccountDTO).toBeInstanceOf(AccountDto);
    expect(returnedAccountDTO?.getAccountId()).toBe(accountDTO.getAccountId());
    expect(returnedAccountDTO?.getName()).toBe(accountDTO.getName());
    expect(returnedAccountDTO?.getEmail()).toBe(accountDTO.getEmail());
    expect(returnedAccountDTO?.getCpf()).toBe(accountDTO.getCpf());
    expect(returnedAccountDTO?.getCarPlate()).toBe(accountDTO.getCarPlate());
    expect(returnedAccountDTO?.getPassword()).toBe(accountDTO.getPassword());
    expect(returnedAccountDTO?.getIsPassenger()).toBe(accountDTO.getIsPassenger());
    expect(returnedAccountDTO?.getIsDriver()).toBe(accountDTO.getIsDriver());
});

describe("Must not find account", () => {
    it("Must return undefined if id doesn't exist", async () => {
        const anotherID = crypto.randomUUID();
        const returnedAccountDTO = await getAccountUseCase.execute(anotherID);
        expect(returnedAccountDTO).toBeUndefined;
    });
    it("Must return undefined if id is not valid", async () => {
        const invalidId: string = "AAA";
        const returnedAccountDTOInvalidId = await getAccountUseCase.execute(invalidId);
        expect(returnedAccountDTOInvalidId).toBeUndefined;
    });
});
