import Helper from "../../../utils/helper";
import {userData} from "../../../utils/globalData";
const { LoginPage } = require('../pages/login.page');



class LoginActions{
    constructor(page) {
       this.loginPage = new LoginPage(page); // Reuse locators
    }

    async login(username) {
        const {usernameInput, passwordInput, loginButton} = this.loginPage;
        await usernameInput.fill(username);
        await passwordInput.fill(userData.register.password.toString());
        await loginButton.click();
        console.log("User Logged in successfully");
    }
}

export default LoginActions;