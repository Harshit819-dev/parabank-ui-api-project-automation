class AccountOverviewPage {
    constructor(page) {
        this.logout = page.locator('//a[normalize-space()="Log Out"]');
        this.accountOverViewOption = page.locator('a:has-text("Accounts Overview")');
        this.checkingAccountNo = page.locator('//table[@id="accountTable"]/tbody/tr[1]/td[1]');
        this.checkingAccBalance = page.locator('//table[@id="accountTable"]/tbody/tr[1]/td[2]');
        this.accountTypefromTable = page.locator('//table[@id="accountTable"]/tbody/tr[1]/td[1]/a');
        this.accountTypeText = page.locator('//td[@id="accountType"]');
        this.openAccountOption = page.locator('a:has-text("Open New Account")');
        this.savingAccountBalance = page.locator('//table[@id="accountTable"]/tbody/tr[2]/td[2]');
        this.availableBalanceForCheckAccount = page.locator('//table[@id="accountTable"]/tbody/tr[1]/td[3]');
        this.transferFundsOption = page.locator('a:has-text("Transfer Funds")');
        this.billPayOption = page.locator('a:has-text("Bill Pay")');
    }
}
module.exports = {AccountOverviewPage};
