import { Page, Locator,expect } from '@playwright/test';

export class Login {
  readonly page: Page;
  readonly iconLogin: Locator;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly expectedElement: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.iconLogin = page.locator("[data-testid='navbar-login']");
    this.userNameInput = page.locator("[data-testid='username-textbox']");
    this.passwordInput = page.locator("[data-testid='password-textbox']");
    this.submitBtn = page.locator("[data-testid='login-button']");
    this.expectedElement = page.locator("[data-testid='navbar-logout']");
    this.errorMessage = page.locator(".error");
  }

  async openLoginPage() {
    await this.page.goto('https://commitquality.com/');
    await this.iconLogin.click();
  
}

  async login(username: string, password: string) {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async verifyLoginSuccess() {
    await expect(this.expectedElement).toBeVisible();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toContainText("Invalid username or password");
  }
}