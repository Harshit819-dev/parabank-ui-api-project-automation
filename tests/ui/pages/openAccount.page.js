class OpenAccountPage {
    constructor(page) {
        this.accountType = page.locator('//select[@id="type"]');
        this.accountID = page.locator('//a[@id="newAccountId"]');
        this.openNewAccountButton = page.locator('//input[@value="Open New Account"]');
    }
}
module.exports = {OpenAccountPage};