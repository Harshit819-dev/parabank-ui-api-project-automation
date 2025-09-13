import {BillPaymentServicePage} from "../pages/billPayment.service.page";
import {faker} from "@faker-js/faker";
import {userData} from "../../../utils/globalData";


class BillPaymentActions {
    constructor(page) {
        this.billPaymentServicePage = new BillPaymentServicePage(page); // Reuse locators
    }

    async billPaymentService({page}, fromAccountNumber, toAccountNumber) {
        const {
            payeeName,
            payeeAddress,
            payeeCity,
            payeeState,
            payeeZipcode,
            payeePhoneNo,
            payeeAccountNo,
            payeeVerifyAccountNo,
            amount,
            fromAccount,
            sendPaymentButton
        } = this.billPaymentServicePage;

        await payeeName.fill(userData.billPaymentService.payeeName.toString());
        await payeeAddress.fill(userData.billPaymentService.payeeAddress.toString());
        await payeeCity.fill(userData.billPaymentService.payeeCity.toString());
        await payeeState.fill(userData.billPaymentService.payeeState.toString());
        await payeeZipcode.fill(faker.location.zipCode());
        await payeePhoneNo.fill(faker.phone.number());
        await payeeAccountNo.fill(toAccountNumber);
        await payeeVerifyAccountNo.fill(toAccountNumber);
        await amount.fill("100");
        await fromAccount.selectOption(fromAccountNumber);
        await sendPaymentButton.click();

        await page.waitForTimeout(500);

        console.log("Bill Payment successfully");
    }
}

export default BillPaymentActions;