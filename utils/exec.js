const { exec } = require("child_process");

module.exports = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) return reject(error.message);
      if (stderr) return reject(stderr);
      resolve(stdout || "✅ Command executed.");
    });
  });
};