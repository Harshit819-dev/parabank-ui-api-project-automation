class FundPage {
    constructor(page) {
        this.amount = page.locator('//input[@id="amount"]');
        this.fromAccountId = page.locator('//select[@id="fromAccountId"]');
        this.toAccountId = page.locator('//select[@id="toAccountId"]');
        this.transferButton = page.locator('//input[@value="Transfer"]');
        this.successMessagePostFundTransfer = page.locator('//div[@id="showResult"]//p[1]');
    }
}

module.exports = {FundPage};