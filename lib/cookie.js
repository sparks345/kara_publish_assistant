/**
 * Created by jinjingcao on 2017/9/11.
 */

const remote = require('electron').remote;

const get = function (key) {
    var r = new RegExp("(?:^|;+|\\s+)\s*" + name + "=([^;]*)"), m = document.cookie.match(r);
    return !m ? "" : decodeURIComponent(m[1]);
}

const set = function (key, value) {

}

const parseAvailable = function (domain) {
    if (domain != null && (!domain.startsWith(".") && !domain.startsWith("/"))) {
        domain = "." + domain;
        console.warn("parseAvailable, fix domain input to:" + domain);
    }

    let ret = "";
    let allCookies = remote.getGlobal("allCookies");
    if (allCookies != null) {
        for (let idx in allCookies) {
            // debugger;
            let cookie = allCookies[idx];
            // not strict but quick
            if (cookie.domain.endsWith(domain)) {
                ret += cookie.name + "=" + cookie.value + ";";
            }
        }
    }

    console.info("current cookie:", ret, allCookies);

    return ret;
}

export {
    get,
    set,
    parseAvailable
}