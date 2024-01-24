export function validateCarPlate (carPlate: string) {
	const expression: RegExp = /^[A-Z]{3,}( ){1}(\d){4}$/i;
	return expression.test(carPlate);
}
