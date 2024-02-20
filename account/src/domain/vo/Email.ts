export default class Email {
    private value: string;

    constructor(value: string) {
        if (!this.validateEmail(value)) throw new Error("Email is invalid");
        this.value = value;
    }

    public static async create(email: string){
        return new Email(email);
    }

    private validateEmail (email: string) {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return expression.test(email);
    }

    getValue() {
        return this.value;
    }
}
