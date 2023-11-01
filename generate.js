const generator = require("./index.js");
const config = require("./config.json");

const runGenerator = async () => {
    await generator.generateAccount(config.usernames, config.accounts, config.webhook);
}
runGenerator()
setInterval(runGenerator, config.interval * 60 * 1000);