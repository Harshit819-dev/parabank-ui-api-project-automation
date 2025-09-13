class BillPaymentServicePage {
    constructor(page) {
        this.payeeName = page.locator('//input[@name="payee.name"]');
        this.payeeAddress = page.locator('//input[@name="payee.address.street"]');
        this.payeeCity = page.locator('//input[@name="payee.address.city"]');
        this.payeeState = page.locator('//input[@name="payee.address.state"]');
        this.payeeZipcode = page.locator('//input[@name="payee.address.zipCode"]');
        this.payeePhoneNo = page.locator('//input[@name="payee.phoneNumber"]');
        this.payeeAccountNo = page.locator('//input[@name="payee.accountNumber"]');
        this.payeeVerifyAccountNo = page.locator('//input[@name="verifyAccount"]');
        this.amount = page.locator('//input[@name="amount"]');
        this.fromAccount = page.locator('//select[@name="fromAccountId"]');
        this.sendPaymentButton = page.locator('//input[@value="Send Payment"]');
    }
}

module.exports = {BillPaymentServicePage};
