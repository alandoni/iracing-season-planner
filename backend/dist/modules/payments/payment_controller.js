"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
class PaymentController {
    donationRepository;
    constructor(donationRepository) {
        this.donationRepository = donationRepository;
    }
    async createPayment(payment) {
        return await this.donationRepository.createPayment(payment.body);
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment_controller.js.map