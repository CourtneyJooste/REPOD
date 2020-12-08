const shell = require('shelljs');

const refresh = process.env.REFRESH_RATE || 10;
const tag = process.env.TAG;
const webhook = process.env.SLACK_WEBHOOK;

if (tag == null) {
    console.log("[REPOD] Please set the TAG environment variable.");
    return;
}

if (refresh <= 0) {
    console.log("[REPOD] Refresh rate cannot be 0 or lower.");
    return;
}

const ONE_MINUTE = 60 * 1000;

const runScript = () => {
    console.log("[REPOD] Executing gitcheck...");
    shell.exec('./gitcheck.sh ' + tag + (webhook ? ' ' + webhook : ''));
    const now = new Date();
    const nextRun = new Date(currentDate.getTime() + refresh * ONE_MINUTE);
    console.log("[REPOD] Gitcheck process complete. Executing next run at " + (new Date(nextRun)).toTimeString());
    setTimeout(() => runScript(), refresh * ONE_MINUTE);
}

console.log("[REPOD] Running repository update daemon...");
console.log("[REPOD] Refresh rate set to " + refresh + " minute(s).");
setTimeout(() => runScript(), 20000);

// TODO: repod helper script that can execute scripts using variables from .env
