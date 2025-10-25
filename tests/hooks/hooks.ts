import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { Login } from '../pages/LoginPage';

interface CustomWorld {
    page: Page;
    context: BrowserContext;
    loginPage: Login;
    attach: (data: any, mimeType: string) => void;
}

let browser: Browser;

BeforeAll(async function() {
    console.log('🚀 Starting test suite...');
    
    browser = await chromium.launch({
        headless: true,
        slowMo: 50
    });
    
    console.log('✅ Browser launched successfully');
});

Before(async function(this: CustomWorld) {
    console.log(`\n📝 Starting new scenario`);
    
    const context: BrowserContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true
    });
    
    const page: Page = await context.newPage();
    
    this.page = page;
    this.context = context;
    this.loginPage = new Login(page);
    
    console.log('✅ New browser context created');
});

After(async function(this: CustomWorld, scenario: any) {
    console.log(`\n🏁 Finished scenario`);
    
    if (scenario.result?.status === Status.FAILED && this.page) {
        try {
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
            console.log('📸 Screenshot taken for failed scenario');
        } catch (error) {
            console.log('❌ Could not take screenshot');
        }
    }
    
    const duration = scenario.result?.duration;
    if (duration && typeof duration === 'number') {
        const durationInSeconds = duration / 1000000000;
        console.log(`⏱️ Scenario duration: ${durationInSeconds.toFixed(2)} seconds`);
    } else {
        console.log('⏱️ Scenario duration: Not available');
    }
    
    if (this.context) {
        await this.context.close();
        console.log('✅ Browser context closed');
    }
});

AfterAll(async function() {
    console.log('\n🎯 Test suite completed');
    
    if (browser) {
        await browser.close();
        console.log('✅ Browser closed');
    }
    
    console.log('📊 Test Execution Summary Completed');
});