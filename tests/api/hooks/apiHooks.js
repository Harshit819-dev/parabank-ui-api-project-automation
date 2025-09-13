import {request} from '@playwright/test';
import {userData} from "../../../utils/globalData";

let api;
let jSessionCookie;

export async function initApiContext() {
    api = await request.newContext();
    return api;
}

export async function loginAndGetSession() {
    const loginResponse = await api.post('/parabank/login.htm', {
        form: {
            username: userData.register.username,
            password: userData.register.password,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    if (loginResponse.status() !== 200) {
        throw new Error(`Login failed with status: ${loginResponse.status()}`);
    }

    const state = await api.storageState();
    const sessionCookie = state.cookies.find(c => c.name === 'JSESSIONID');
    jSessionCookie = sessionCookie?.value;

    return jSessionCookie;
}

export function getApi() {
    return api;
}

export function getSession() {
    return jSessionCookie;
}
