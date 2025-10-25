import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { Connection } from 'mysql2/promise';

export class CustomWorld extends World {
    public browser!: Browser;
    public context!: BrowserContext;
    public page!: Page;
    public connection!: Connection;
    public currentUser: any;
    public screenshots: string[] = [];
    public attachments: any[] = [];
    public scenarioResult: any;

    constructor(options: IWorldOptions) {
        super(options);
    }
    public async takeScreenshot(name: string): Promise<void> {
        if (this.page) {
            const screenshot = await this.page.screenshot();
            const screenshotName = `${name}_${Date.now()}.png`;
            this.screenshots.push(screenshotName);
            this.attach(screenshot, 'image/png');
        }
    }

    public async logStep(step: string): Promise<void> {
        console.log(`📝 ${step}`);
        if (this.scenarioResult) {
            this.scenarioResult.steps.push({
                text: step,
                timestamp: new Date()
            });
        }
    }

    public async waitForNetworkIdle(): Promise<void> {
        if (this.page) {
            await this.page.waitForLoadState('networkidle');
        }
    }
}