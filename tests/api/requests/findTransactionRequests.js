// requests/transactionRequests.js
export async function getTransactionByAmount(api, accountNo) {
    const response = await api.get(
        `/parabank/services_proxy/bank/accounts/${accountNo}/transactions/amount/100?timeout=30000`,
        {
            headers: {
                'Accept': 'application/json',
                'Referer': 'https://parabank.parasoft.com/parabank/findtrans.htm',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }
    );

    if (!response.ok()) {
        throw new Error(`Transaction fetch failed: ${response.status()}`);
    }

    return await response.json();
}
