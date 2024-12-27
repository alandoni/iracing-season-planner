export declare class Payment {
    id: number;
    dateCreated: Date;
    dateApproved: Date;
    expirationDate: Date;
    moneyReleaseDate: Date;
    paymentMethodId: string;
    status: string;
    currency: string;
    taxes: number;
    fees: number;
    qrCodeBase64: string;
    qrCode: string;
}
