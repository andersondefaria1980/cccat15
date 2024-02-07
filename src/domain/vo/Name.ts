export default class Name {
    private value: string;

    constructor(value: string) {
        if (!this.validateFullName(value)) throw new Error("Name is invalid");
        this.value = value;
    }

    public static async create(name: string) {
        return new Name(name);
    }

    private validateFullName (fullName: string) {
        const expression: RegExp = /^[A-Za-z]{3,}[ ][A-Za-z]{2,}[A-Za-z ]*$/i;
        return expression.test(fullName);
    }

    getValue() {
        return this.value;
    }
}
