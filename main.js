/**
 * Created by jinjingcao on 2017/9/4.
 */
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const ipcMain = require('electron').ipcMain;

// const CookieManage = require(path.join(__dirname, 'dist/lib/CookieManage.js'));

const MAIN_URL = url.format(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
}));
const LOGIN_URL = "http://rdm.oa.com/cas/login?service=http%3A%2F%2Frdm.oa.com%2Fci%2Fshiro-cas";//"http://passport.oa.com/modules/passport/signin.ashx?url=http://musiclog.oa.com/mobilepackage/index.php?showtime=2892000&appkey=8d938e301cd64526a4691d660cf6b1f6";
const MAIN_LOGIN_ON_URL = "http://rdm.oa.com/ci/";//"http://musiclog.oa.com/mobilepackage/index.php";

let mainWindow;

// const {session, app, BrowserWindow} = require('electron');
const session = electron.session;

// call back from setCookie of render process.
ipcMain.on("setCookie", function (event) {
    console.warn("setCookie from render.");
});

function createWindow() {
    if (mainWindow != null) return;

    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.openDevTools({mode: "bottom"});

    mainWindow.loadURL(LOGIN_URL);

    getAllCookies();

    mainWindow.on('close', function () {
        mainWindow = null;
    });

    mainWindow.webContents.on('dom-ready', function () {
        console.warn("XX");
        if (mainWindow.getURL().startsWith(MAIN_LOGIN_ON_URL)) {
            // debugger;
            mainWindow.loadURL(MAIN_URL);
        }

    });

    // const remoteWindow = require('electron').BrowserWindow;
    // remoteWindow.addDevToolsExtension();
}

function getAllCookies() {
    session.defaultSession.cookies.get({}, (error, cookies) => {
        // Cookies can be accessed here using cookies variable
        if (error == null) {
            global.allCookies = cookies;
            // CookieManage.cache(cookies);
        }
    });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
