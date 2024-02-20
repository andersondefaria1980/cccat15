export default interface PaymentGateway {
    processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output>;
}

export class PaymentGatewayConsole implements PaymentGateway {
    public static STATUS_OK: "OK";
    public static STATUS_ERROR: "ERROR";

	async processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output> {
        return {
            status: PaymentGatewayConsole.STATUS_OK,
            message: `Processed payment: Ride: ${rideId} - Amount: ${amount}`,
        }
	}
}

type Output = {
    status: string,
    message: string,
}
