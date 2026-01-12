const run = require("./exec");
const log = require("./logger");
const config = require("../config/bruteforce.json");

async function getFailedIPs() {
  const minutes = config.windowMinutes;
  const cmd = `
powershell -Command "
$time = (Get-Date).AddMinutes(-${minutes});
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=$time} |
ForEach-Object {
  if ($_.Message -match 'Source Network Address:\\s+(\\d+\\.\\d+\\.\\d+\\.\\d+)') {
    $matches[1]
  }
} | Group-Object | Where-Object { $_.Count -ge ${config.maxAttempts} } | Select-Object -ExpandProperty Name
"
`;
  const out = await run(cmd);
  return out.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
}

async function banIP(ip) {
  await run(
    `netsh advfirewall firewall add rule name="RDP-BRUTE-${ip}" dir=in action=block protocol=TCP remoteip=${ip}`
  );
}

module.exports = async () => {
  try {
    const ips = await getFailedIPs();
    for (const ip of ips) {
      await banIP(ip);
      log(
        { user: { tag: "SYSTEM", id: "BRUTE" }, commandName: "BRUTE_FORCE" },
        "AUTO_BAN",
        "SUCCESS",
        ip
      );
    }
  } catch (e) {
    log(
      { user: { tag: "SYSTEM", id: "BRUTE" }, commandName: "BRUTE_FORCE" },
      "AUTO_BAN",
      "FAILED",
      e.toString()
    );
  }
};