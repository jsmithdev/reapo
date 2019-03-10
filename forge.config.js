// jshint esversion:6, asi: true, laxcomma: true

const path = require('path');

module.exports = {
    "forge": {
        "make_targets": {
          "win32": [
            "squirrel"
          ],
          "darwin": [
            "zip"
          ],
          "linux": [
            "deb",
            "rpm"
          ]
        },
        "electronPackagerConfig": {
          "packageManager": "npm",
          "icon": path.resolve(__dirname, '/src/icon.png')
        },
        "electronWinstallerConfig": {
          "name": "reapo"
        },
        "electronInstallerDebian": {},
        "electronInstallerRedhat": {},
        "github_repository": {
          "owner": "dubyajaysmith",
          "name": "reapo"
        },
        "windowsStoreConfig": {
          "packageName": "reapo",
          "name": "reapo"
        }
    }
}
console.dir(module.exports.forge.electronPackagerConfig.icon)