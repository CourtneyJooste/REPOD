const shell = require('shelljs');

const tag = process.env.TAG;
const webhook = process.env.SLACK_WEBHOOK;

if (tag == null) {
    console.log("[REPOD] Please set the TAG environment variable.");
    return;
}

const runScript = () => {
    console.log("[REPOD] Executing rebuild...");
    shell.exec('./rebuild.sh ' + tag + (webhook ? ' ' + webhook : ''));
    console.log("[REPOD] Rebuild process complete.");
}

console.log("[REPOD] Running manual rebuild...");
runScript();
