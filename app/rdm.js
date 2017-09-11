/**
 * Created by jinjingcao on 2017/9/4.
 */

const path = require('path');
const cookie = require(path.join(__dirname, "../lib/cookie.js"));

const PRODUCT_ID = "8ca63999-944b-4628-abfa-e7572ed15146";
const FT_ID = "3968";
const RDM_MAIN_PAGE = "http://rdm.oa.com/ci/product/" + PRODUCT_ID + "/jobs/ft/" + FT_ID;
// http://rdm.oa.com/ci/api/job!getJobList?filterStatus=7,-1&ftId=3968&limit=200&productId=8ca63999-944b-4628-abfa-e7572ed15146&start=0
const CGI = "http://rdm.oa.com/ci/api/job!getJobList";

class RdmTask {

    constructor(data) {
        this.data = data;
    }

    render() {

    }

    invokeStart() {

    }
}

function init() {
    let param = [
        ["filterStatus", "7,-1"].join("="),
        ["limit", 200].join("="),
        ["start", 0].join("="),
        ["productId", PRODUCT_ID].join("="),
        ["ftId", FT_ID].join("=")
    ].join("&");

    let head = new Headers();
    // debugger;
    let cookieStr = cookie.parseAvailable(".oa.com");
    head.append("Cookie", cookieStr);
    // head.append('X-my-header', 'my-header');

    fetch(CGI + "?" + param, {
        credentials: 'include',// IMPORTANT, For CORS requests, use the "include" value to allow sending credentials to other domains, optional 'same-origin'
        headers: head
    }).then(function (resp) {
        return resp.json();
    }).then(function (data) {
        console.log(data);
        if (data != null && data.errno == 0) {
            for (let idx = 0; idx < data.list.length; idx++) {
                let taskData = data.list[idx];
                new RdmTask(taskData);
            }
        }
    });

    // fetch(CGI, {
    //     method: "get",
    //     body: [
    //         ["filterStatus", "7,-1"].join("="),
    //         ["limit", 200].join("="),
    //         ["start", 0].join("="),
    //         ["productId", PRODUCT_ID].join("="),
    //         ["ftId", FT_ID].join("=")
    //     ].join("&")
    // }).then(function (resp) {
    //     return resp.text();
    // }).then(function (text) {
    //     console.log(text);
    //     alert(text);
    // });
    // alert("XMF");
};

export {init};