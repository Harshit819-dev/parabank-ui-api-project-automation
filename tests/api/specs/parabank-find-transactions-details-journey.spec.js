import {test, expect} from '@playwright/test';
import {initApiContext, loginAndGetSession, getApi} from '../hooks/apiHooks';
import {getTransactionByAmount} from '../requests/findTransactionRequests';
import {userData} from "../../../utils/globalData";


test.beforeAll(async () => {
    await initApiContext();
    await loginAndGetSession();
});

test('Validate Transaction details for User', async () => {
    const api = getApi();

    const transactionData = await getTransactionByAmount(api, userData.accountDetails.checkingAccountNo);

    expect(transactionData).toBeTruthy();

    //store response in json format
    const transactionResponse = await transactionData;

    //validate Transaction details
    for (const transactionData of transactionResponse) {
        expect(transactionData.accountId).toBe(parseInt(userData.accountDetails.checkingAccountNo));
        expect(transactionData.type).toBe('Debit');
        expect(transactionData.description).toBe('Funds Transfer Sent');
        expect(transactionData.amount).toBe(100);
    }
});
