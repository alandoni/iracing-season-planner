"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const utils_1 = require("utils");
const index_1 = require("backend/logger/index");
const mp_payment_request_1 = require("./mp_payment_request");
class PaymentRepository {
    service;
    logger;
    constructor(service, logger = utils_1.DI.get(index_1.WinstonLogger)) {
        this.service = service;
        this.logger = logger;
    }
    async createPayment(payment) {
        const payload = new mp_payment_request_1.MPPaymentRequest();
        payload.description = `Doação de ${payment.amount ?? "0"} feita via PIX feita por ${payment.firstName ?? "anônimo"} ${payment.lastName ?? ""}`;
        payload.transaction_amount = payment.amount;
        payload.payment_method_id = "pix";
        payload.payer = {
            first_name: payment.firstName,
            last_name: payment.lastName,
            email: payment.email ?? "generic@example.com",
        };
        const response = await this.service.createPayment(payload);
        this.logger.info(JSON.stringify(response));
        return {
            id: response.id,
            dateCreated: response.date_created,
            dateApproved: response.date_approved,
            expirationDate: response.date_of_expiration,
            moneyReleaseDate: response.money_release_date,
            paymentMethodId: response.payment_method_id,
            status: response.status,
            currency: response.currency_id,
            taxes: response.taxes_amount,
            fees: response.fee_details.reduce((acc, item) => acc + item.amount, 0),
            qrCodeBase64: response.point_of_interaction.transaction_data.qr_code_base64,
            qrCode: response.point_of_interaction.transaction_data.qr_code,
        };
    }
}
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=payment_repository.js.map