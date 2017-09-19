/**
 * Created by jinjingcao on 2017/9/4.
 */

import * as rdm from "./mod/rdm";

require('electron-cookies');

const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.send("setCookie", "test...test...");

rdm.init();
