import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 40 * 1000,  // per-test timeout
    retries: 1,           // number of retries on failure
    workers: 1,         // number of parallel workers
    reporter: [
        ['list'], // console output
        ['allure-playwright'], // allure results
        ['html', {open: 'never'}], // Playwright HTML report
    ],
    use: {
        baseURL: 'https://parabank.parasoft.com/', //Base URL for the tests
        headless: false,
        viewport: {width: 1280, height: 720},
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [{
        name: 'UI Tests',
        testDir: './tests/ui',  // UI folder runs first
    },
        {
            name: 'API Tests',
            testDir: './tests/api', // API folder runs after UI
        },
    ]
});
