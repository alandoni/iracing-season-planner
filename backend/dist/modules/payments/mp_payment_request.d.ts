export declare class MPPaymentRequest {
    transaction_amount: number;
    description: string;
    payment_method_id: "pix";
    payer: {
        first_name?: string;
        last_name?: string;
        email: string;
    };
}
