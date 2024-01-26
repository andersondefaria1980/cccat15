export default class AccountApiTestUtils {
    public validateAccountResponse(a: any) {
        expect(typeof(a.accountId)).toBe("string");
        expect(typeof(a.name)).toBe("string");
        expect(typeof(a.email)).toBe("string");
        expect(typeof(a.cpf)).toBe("string");
        expect(typeof(a.carPlate)).toBe("string");
        expect(typeof(a.isPassenger)).toBe("boolean");
        expect(typeof(a.isDriver)).toBe("boolean");
    }
}