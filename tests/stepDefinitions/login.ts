const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { Login } = require('../pages/LoginPage');
const { getUserById } = require('../utils/db');

interface World {
    page: any;
    loginPage: any;
    context: any;
}

Given('I open the login page', async function(this: World) {
    if (!this.page) {
        throw new Error('Page is not initialized. Make sure hooks are set up correctly.');
    }
    
    this.loginPage = new Login(this.page);
    await this.loginPage.openLoginPage();
    console.log('✅ Login page opened');
});

When('I fill username and password from database user', async function(this: World) {
    if (!this.loginPage) {
        throw new Error('Login page is not initialized. Make sure to open login page first.');
    }

    const user = await getUserById(1);
    if (!user) {
        throw new Error('User with id=1 not found in DB');
    }
    
    const username = user.username;
    const password = user.password;
    
    await this.loginPage.login(username, password);
    console.log(`✅ Filled credentials for user: ${username}`);
});


Then('I should verify login success', async function(this: World) {
    if (!this.loginPage) {
        throw new Error('Login page is not initialized.');
    }
    
    await this.loginPage.verifyLoginSuccess();
    console.log('✅ Login success verified');
});

Then('I should verify login error', async function(this: World) {
    if (!this.loginPage) {
        throw new Error('Login page is not initialized.');
    }
    
    await this.loginPage.verifyLoginError();
    console.log('✅ Login error verified');
});