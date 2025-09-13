class RegisterPage {
    constructor(page) {
        this.firstName = page.locator('//input[@id="customer.firstName"]');
        this.lastName = page.locator('//input[@id="customer.lastName"]');
        this.address = page.locator('//input[@id="customer.address.street"]');
        this.city = page.locator('//input[@id="customer.address.city"]');
        this.state = page.locator('//input[@id="customer.address.state"]');
        this.zipcode = page.locator('//input[@id="customer.address.zipCode"]');
        this.phoneNo = page.locator('//input[@id="customer.phoneNumber"]');
        this.ssn = page.locator('//input[@id="customer.ssn"]');
        this.username = page.locator('//input[@id="customer.username"]');
        this.password = page.locator('//input[@id="customer.password"]');
        this.confirmPassword = page.locator('//input[@id="repeatedPassword"]');
        this.successMessage = page.locator('//div[@id="rightPanel"]/p');
    }
}
module.exports = {RegisterPage };