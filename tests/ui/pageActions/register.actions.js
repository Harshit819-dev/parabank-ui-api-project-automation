import {userData} from "../../../utils/globalData";
const { RegisterPage } = require('../pages/registerUser.page');


class UserRegisterActions{
    constructor(page) {
       this.registerPage = new RegisterPage(page); // Reuse locators
    }

    async register({page},uniqueUsername) {
        const {firstName, lastName, address, city, state, zipcode, phoneNo, ssn, username, password, confirmPassword} = this.registerPage;

        await firstName.fill(userData.register.firstName.toString());
        await lastName.fill( userData.register.lastName.toString());
        await address.fill(userData.register.address.toString());
        await city.fill(userData.register.city.toString());
        await state.fill(userData.register.state.toString());
        await zipcode.fill(userData.register.zipCode.toString());
        await phoneNo.fill(userData.register.phoneNo.toString());
        await ssn.fill(userData.register.ssn.toString());
        await username.fill(uniqueUsername);
        await password.fill(userData.register.password.toString());
        await confirmPassword.fill(userData.register.confirmPassword.toString());

        await page.waitForTimeout(500);

        await Promise.all([
            page.click('input[type="submit"][value="Register"], button:has-text("Register")'),
            page.waitForNavigation({ waitUntil: 'idleTimeForNetwork', timeout: 10000 }).catch(() => {}),
        ]);

        console.log("User Registered successfully");
    }
}

export default UserRegisterActions;