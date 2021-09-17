//we use this file to open desktop application - Electron
// to run this desktop app on terminal - npm run launch
const { BrowserWindow, app } = require('electron');
require('../app.js');

let mainWindow = null;

function main() {
    mainWindow = new BrowserWindow()
    mainWindow.loadURL(`http://localhost:3000/`)
    mainWindow.on('close', event => {
        mainWindow = null
    })
}

app.on('ready', main);