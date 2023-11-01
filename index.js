const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const randomstring = require('randomstring');
const fs = require('fs').promises;
const axios = require("axios");

async function generateAccount(usernameFile, outputPath, webhook) {
    let username1 = await getRandomUsername(usernameFile);
    const password1 = randomstring.generate(25);
    const chromeOptions = new chrome.Options()
    .addArguments('--disable-extensions')
    .addArguments('--enable-javascript')
    .setProxy({
      proxyType: 'manual',
    })
    //.addArguments("--headless");

    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  

  try {
    const embed = {
      title: 'Generating ',
      description: `Trying to generate a new account!`,
      color: 0x00ff00,
    };
    try {
      await axios.post(webhook, { embeds: [embed] });
    } catch (err) {
      console.error('Error sending message to Discord webhook:', err.message);
    }
    await driver.get('https://www.roblox.com');
    await driver.findElement(By.id('MonthDropdown')).sendKeys('January');
    await driver.findElement(By.id('DayDropdown')).sendKeys('1');
    await driver.findElement(By.id('YearDropdown')).sendKeys('2000');
    await driver.findElement(By.id('signup-username')).sendKeys(username1);
    await driver.findElement(By.id('signup-password')).sendKeys(password1);
    await driver.executeScript("arguments[0].click();", await driver.findElement(By.id('MaleButton')));
    await driver.executeScript('document.querySelector(".cookie-description-content").style.display = "none";');
    await driver.findElement(By.xpath('//button[contains(text(), "Accept All")]')).click();
    await driver.findElement(By.name('signupSubmit')).click();
    
    //await driver.wait(until.elementLocated(By.className))

    const errorText = await driver.findElement(By.id('signup-usernameInputValidation')).getText();
    

    if (errorText.includes('This username is already in use.')) {
      console.log(`Error: Username "${username1}" is taken. Skipping account.`);
    } else if (errorText.includes('Username not appropriate for Roblox.')) {
      console.log(`Error: Username "${username1}" is not appropriate. Skipping account.`);
    } else {
      console.log(`Account generated successfully - Username: ${username1}`);
    }
  } finally {
    await driver.wait(until.elementLocated(By.className('thumbnail-2d-container avatar-card-image')));
    await driver.findElement(By.className("btn-navigation-nav-settings-md")).click();
    await driver.findElement(By.className("rbx-menu-item logout-menu-item")).click();
    await driver.wait(until.elementLocated(By.className('change-email-button')));
    await driver.findElement(By.className("change-email-button")).click();
    console.log("generation done ig");
    const accountDetails = `${username1}:${password1}\n`;
    await fs.appendFile(outputPath, accountDetails);
    
    const fileContent = await fs.readFile(outputPath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const stockCount = lines.length;
    const embed = {
      title: 'New account generated',
      description: `Accounts in stock: ${stockCount}`,
      color: 0x00ff00,
    };
    try {
      await axios.post(webhook, { embeds: [embed] });
    } catch (err) {
      console.error('Error sending message to Discord webhook:', err.message);
    }
  }
  await driver.wait(until.elementLocated(By.id("login-button")));
  driver.quit();
}

async function getRandomUsername(usernameFile) {
  const usernames = (await fs.readFile(usernameFile, 'utf-8')).split('\n');
  const randomIndex = Math.floor(Math.random() * usernames.length);
  const randomUsername = usernames[randomIndex].trim();
  const suffix = randomstring.generate(4);

  return `${randomUsername}_${suffix}`;
}

module.exports = {
  generateAccount,
};  