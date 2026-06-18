/*
 * Frees a TCP port before a dev server starts, so a leftover instance can't
 * squat the port or (worse) keep serving stale code. Cross-platform via the
 * kill-port package (netstat/taskkill on Windows, lsof/kill on Unix).
 *
 * Always exits 0: a port that is already free is success, not an error — the
 * pre-script must never block the real start.
 *
 * Usage (wired as a pre* npm script): node scripts/free-port.cjs <port>
 */
const kill = require("kill-port");

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port <= 0) {
  console.error("[free-port] usage: node scripts/free-port.cjs <port>");
  process.exit(0);
}

kill(port, "tcp")
  .then(() => console.log(`[free-port] freed :${port}`))
  .catch(() => console.log(`[free-port] :${port} was already free`))
  .finally(() => process.exit(0));
