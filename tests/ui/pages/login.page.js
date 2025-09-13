class LoginPage {
    constructor(page) {
        this.usernameInput = page.locator('//input[@name="username"]');
        this.passwordInput = page.locator('//input[@name="password"]');
        this.loginButton = page.locator('//input[@class="button"]');
    }
}

module.exports = {LoginPage};