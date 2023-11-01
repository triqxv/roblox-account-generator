# Roblox Account Generator
To use this you will need selenium (nodejs), the randomstring module, and axios.
so run
```
npm i randomstring@latest && npm i selenium-webdriver@latest && npm i axios@latest
```
In your terminal.

change the usernames in usernames.txt, the accounts will be saved in accounts.txt but you change it in config.json
to run it type in
```
node generate.js
```
in your terminal.

Used to generate roblox accounts. no captcha bypass, all in pure node.js

also to get announced if a new alt is generated, you have to change the webhook in config.json to your discord webhook.

Also i would not recommend running this on your main pc, since roblox will flag you.

![example](https://raw.githubusercontent.com/linemaster2/roblox-account-generator/main/images/example.gif)
