const shell = require('shelljs');

const refresh = process.env.REFRESH_RATE;
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

const runScript = () => {
    console.log("[REPOD] Executing gitcheck...");
    shell.exec('./gitcheck.sh ' + tag + (webhook ? ' ' + webhook : ''));
    const now = new Date();
    const nextRun = now.setMinutes(now.getMinutes() + refresh);
    console.log("[REPOD] Gitcheck process complete. Executing next run at " + (new Date(nextRun)).toTimeString());
    setTimeout(() => runScript(), refresh * 60 * 1000);
}

console.log("[REPOD] Running repository update daemon...");
console.log("[REPOD] Refresh rate set to " + refresh + " minute(s).");
setTimeout(() => runScript(), 20000);

// TODO: repod helper script that can execute scripts using variables from .env
