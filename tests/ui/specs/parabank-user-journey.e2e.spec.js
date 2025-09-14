import {test, expect} from '@playwright/test';
import {chromium} from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';
import UserRegisterActions from "../pageActions/register.actions";
import {faker} from '@faker-js/faker';
import LoginActions from "../pageActions/login.actions";
import BillPaymentServiceActions from "../pageActions/billPayment.service.actions";
import { userData } from '../../../utils/globalData.js';
import {RegisterPage} from "../pages/registerUser.page";
import {AccountOverviewPage} from "../pages/account.overview.page";
import {OpenAccountPage} from "../pages/openAccount.page";
import {FundPage} from "../pages/fund.page";



//Global variables shared across tests
let context;
let page;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-profile-'));
const uniqueUsername = 'Bank' + faker.internet.email().toString().substring(0, 10);
let checkingAccBalance;
let savingAccBalance;
let checkingAccNo;
let savingAccNo;


test.describe.serial('ParaBank E2E User Journey', () => {
    test.beforeAll(async () => {

        // Optional: set path to a real Chrome binary to better match UA/TLS fingerprint
        const executablePath = undefined;

        context = await chromium.launchPersistentContext(userDataDir, {
            headless: true,
            executablePath,
            args: [
                '--start-maximized',
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ],
            viewport: null,
            locale: 'en-US',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        });

        // create a page and attach logging
        page = await context.newPage({devtools: false});


        page.on('console', (m) => console.log('PAGE LOG>', m.type(), m.text()));
        page.on('requestfailed', (req) =>
            console.log('REQ FAIL>', req.url(), req.failure()?.errorText)
        );
        page.on('response', (res) => {
            if (res.status() >= 400) console.log('BAD RESP>', res.status(), res.url());
        });

        // Stealth handling
        await page.addInitScript(() => {
            try {
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            } catch (e) {
            }
            try {
                Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            } catch (e) {
            }
            try {
                Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3]});
                Object.defineProperty(navigator, 'mimeTypes', {get: () => [{type: 'application/pdf'}]});
            } catch (e) {
            }
            try {
                window.chrome = window.chrome || {runtime: {}};
            } catch (e) {
            }
            try {
                const originalQuery = navigator.permissions.query;
                navigator.permissions.query = (params) =>
                    params && params.name === 'notifications'
                        ? Promise.resolve({state: Notification.permission})
                        : originalQuery(params);
            } catch (e) {
            }
            try {
                const glProto = WebGLRenderingContext && WebGLRenderingContext.prototype;
                if (glProto) {
                    const orig = glProto.getParameter;
                    glProto.getParameter = function (p) {
                        return orig.call(this, p);
                    };
                }
            } catch (e) {
            }
        });

        await context.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
        });
    });

    test.afterAll(async () => {
        if (context) await context.close();
        console.log('Profile stored at', userDataDir);
    });

    test('Verify User is registered successfully for paraBank', async () => {

        const resp = await page.goto('parabank/register.htm', {waitUntil: 'networkidle', timeout: 30000});


        // initial page load - check for 200s
        expect(resp).not.toBeNull();
        expect(resp.status()).toBeLessThan(400);

        const content = await page.content();

        if (/cloudflare|captcha|challenge|cf-chl/i.test(content)) {
            console.warn('Page contains possible Cloudflare/CAPTCHA challenge — check screenshots.');
            await page.screenshot({path: 'para-bank-challenge.png', fullPage: true});
        }

        // wait for the registration form (tolerant selector)
        await page.waitForSelector('form#registerForm, form[action*="register"]', {timeout: 8000});
        const userRegister = new UserRegisterActions(page);
        const registerPage = new RegisterPage(page)

        // call your register method
        await userRegister.register({page}, uniqueUsername);

        // check success message or fail and save screenshot
        let success = await registerPage.successMessage.textContent()
        console.log("success count", success)
        if (success.toString() != null) {
            console.log('Registration appears successful for', uniqueUsername);
            expect(success).toEqual('Your account was created successfully. You are now logged in.');
        } else {
            const screenshotPath = 'screenshots/para-bank-fail.png';
            await page.screenshot({path: screenshotPath, fullPage: true});

            //validation messages
            const errors = await page.$$eval('.error, .validation', (els) => els.map((e) => e.textContent.trim()));
            console.log('Validation/errors on page:', errors);
            test.info().attachments.push({
                name: 'para-bank-fail-screenshot',
                path: screenshotPath,
                contentType: 'image/png',
            });
        }
    });

    test('Verify User is logged in successfully with valid username', async () => {

        const accountOverviewPage= new AccountOverviewPage(page)
        await page.waitForTimeout(20000);
        await accountOverviewPage.logout.click();
        await page.waitForLoadState('networkidle');


        const login = new LoginActions(page);
        await login.login(uniqueUsername)
        await page.waitForTimeout(2000);

        //validate initial balance $550 is there in first account
        await accountOverviewPage.accountOverViewOption.click();
        await page.waitForTimeout(1000);

        //store checking account
        checkingAccNo = (await accountOverviewPage.checkingAccountNo.textContent()).trim();
        console.log("checkingAccNo", checkingAccNo)

        //Save AccountNo and username in userData.json file
        userData.accountDetails.checkingAccountNo = checkingAccNo;
        userData.register.username = uniqueUsername;
        fs.writeFileSync('./testdata/userData.json', JSON.stringify(userData, null, 2));
        console.log("data written to file:", checkingAccNo);

        //store checking account balance
        checkingAccBalance = await accountOverviewPage.checkingAccBalance.innerText();
        console.log("checkingAccBalance", checkingAccBalance);

        //Validate Account type
        await accountOverviewPage.accountTypefromTable.click();

        await page.waitForTimeout(1000);
        let accType = (await accountOverviewPage.accountTypeText.textContent()).trim();
        expect(accType).toEqual('CHECKING');
    });

    test('Verify Global navigation menu on home page is working as expected', async () => {

        const accountOverviewPage= new AccountOverviewPage(page)
        const menuItems = [
            {linkText: 'Open New Account', expectedUrl: 'parabank/openaccount.htm', expectedHeading: 'Open New Account'},
            {linkText: 'Accounts Overview', expectedUrl: 'parabank/overview.htm', expectedHeading: 'Accounts Overview'},
            {linkText: 'Transfer Funds', expectedUrl: 'parabank/transfer.htm', expectedHeading: 'Transfer Funds'},
            {linkText: 'Bill Pay', expectedUrl: 'parabank/billpay.htm', expectedHeading: 'Bill Payment Service'},
            {linkText: 'Find Transactions',expectedUrl: 'parabank/findtrans.htm', expectedHeading: 'Find Transactions'},
            {linkText: 'Update Contact Info',expectedUrl: 'parabank/updateprofile.htm', expectedHeading: 'Update Profile'},
            {linkText: 'Request Loan', expectedUrl: 'parabank/requestloan.htm', expectedHeading: 'Apply for a Loan'}
        ];

        for (const item of menuItems) {
            // Click menu item
            await page.click(`a:has-text("${item.linkText}")`);
            console.log("click on ", item.linkText)

            // Verify URL contains expected path
            await expect(page).toHaveURL(new RegExp(item.expectedUrl));
            console.log('URL verified:', item.expectedUrl);

            // Verify heading exists on the page
            await expect(page.locator(`h1:has-text("${item.expectedHeading}")`)).toBeVisible();
            console.log('Heading verified:', item.expectedHeading);

            // Navigate back to Overview page for next iteration (except last one)
            if (item.linkText !== 'Request Loan') {
                await accountOverviewPage.accountOverViewOption.click();
                await expect(page).toHaveURL('parabank/overview\.htm');
            }
        }
    });

    test('Verify User is able to create saving account successfully', async () => {
        const accountOverviewPage= new AccountOverviewPage(page)
        const openAccountPage=new OpenAccountPage(page);
        await accountOverviewPage.openAccountOption.click()
        await openAccountPage.accountType.click()
        await openAccountPage.accountType.selectOption('1'); // Assuming '1' is the value for Savings
        console.log("savings account selected");
        await openAccountPage.openNewAccountButton.click();
        await page.waitForTimeout(2000);
    })

    test("Validate Account overview page is displaying the balance details as expected.", async () => {

        const openAccountPage=new OpenAccountPage(page);
        const accountOverviewPage= new AccountOverviewPage(page)
        //store saving account number
        savingAccNo = (await openAccountPage.accountID.textContent()).trim();
        console.log("savingAccNo", typeof savingAccNo)

        //go to account overview page
        await accountOverviewPage.accountOverViewOption.click();
        await expect(page).toHaveURL("parabank/overview.htm");

        //store saving account balance
        savingAccBalance = await accountOverviewPage.savingAccountBalance.innerText()
        console.log("savingAccBalance", savingAccBalance)
        savingAccBalance = savingAccBalance.toString().replace('$', '');

        //calculate total balance - saving account balance
        checkingAccBalance = checkingAccBalance.toString().replace('$', '');
        let remainingBalanceForCheckAccount = (parseFloat(checkingAccBalance) - parseFloat(savingAccBalance)).toFixed(2);
        checkingAccBalance = '$' + remainingBalanceForCheckAccount.toString();
        console.log("totalBalance", checkingAccBalance);

        //validate checking account balance post creating saving account
        let availableBalanceForCheckAccount = await accountOverviewPage.availableBalanceForCheckAccount.innerText()
        console.log("availableBalanceForCheckAccount", availableBalanceForCheckAccount);
        expect(availableBalanceForCheckAccount).toEqual(checkingAccBalance);
    })

    test("Validate fund transfer from checking account to saving account", async () => {
        //click on transfer fund link
        const accountOverviewPage= new AccountOverviewPage(page)
        const fundPage=new FundPage(page);
        await accountOverviewPage.transferFundsOption.click();
        await expect(page).toHaveURL("parabank/transfer.htm");

        //select from account - checking account
        await fundPage.amount.fill("100");
        console.log("amount entered");

        //select account from accountFrom dropdown
        console.log("checkingAccNo", checkingAccNo)
        await fundPage.fromAccountId.click()
        await fundPage.fromAccountId.selectOption(checkingAccNo)

        console.log(checkingAccNo + "account selected");

        //select account to accountTo dropdown
        console.log("savingAccNo", savingAccNo)
        await fundPage.toAccountId.click();
        await fundPage.toAccountId.selectOption(savingAccNo)

        //click on transfer button
        await fundPage.transferButton.click();
        await page.waitForTimeout(2000);

        //validate the success message for transfer of funds
        const expectedMessage = `$100.00 has been transferred from account #${checkingAccNo} to account #${savingAccNo}.`;
        let successMessage = (await fundPage.successMessagePostFundTransfer.textContent()).trim();
        console.log("successMessage", successMessage)
        expect(successMessage).toEqual(expectedMessage);
    })

    test("Validate Bill Payment made Successfully", async () => {

        const accountOverviewPage= new AccountOverviewPage(page)
        //click on bill pay link
        await accountOverviewPage.billPayOption.click();
        await expect(page).toHaveURL("parabank/billpay.htm");
        const billPaymentActions = new BillPaymentServiceActions(page);

        // call your billPayment Service method
        await billPaymentActions.billPaymentService({page}, savingAccNo, checkingAccNo);

    })
});
