import axios from "axios";

export default interface PaymentGatewayInterface {
    processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output>;
}

export class PaymentGateway implements PaymentGatewayInterface {
	async processPayment (rideId: string, creditCardToken: string, amount: number): Promise<Output> {
        const input = {
            creditCardToken: creditCardToken,
            amount: amount,
        };
        const response = await axios.post(`http://localhost:3002/payment/process`, input);
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
