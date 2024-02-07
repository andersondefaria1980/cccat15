export default class CarPlate {
    private value: string;

    constructor(value: string) {
        if (!this.validateCarPlate(value)) throw new Error("Car plate is invalid");
        this.value = value;
    }

    private validateCarPlate (carPlate: string) {
        const expression: RegExp = /^[A-Z]{3,}( ){1}(\d){4}$/i;
        return expression.test(carPlate);
    }

    public static async create(value: string) {
        return new CarPlate(value);
    }

    getValue() {
        return this.value;
    }
}
