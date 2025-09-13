import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    reporter: [
        ['list'], // console output
        ['allure-playwright'], // allure results
        ['html', { open: 'never' }], // Playwright HTML report
    ],
    use: {
        baseURL: 'https://parabank.parasoft.com/', //Base URL for the tests
        headless: false,
        viewport: {width: 1280, height: 720},
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    }
});
