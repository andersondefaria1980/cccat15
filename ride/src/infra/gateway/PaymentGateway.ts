import axios from "axios";

export default interface PaymentGateway {
    processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output>;
}

export class PaymentGatewayConsole implements PaymentGateway {
	async processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output> {
        const input = {
            creditCardToken: creditCardToken,
            amount: amount,
        };
        const response= await axios.post(`http://localhost:3002/payment/process`, input);
        return response.data;
	}
}

type Output = {
    paymentId: string,
    creditCardToken: string,
    amount: number,
    success: boolean,
    description: string,
}
