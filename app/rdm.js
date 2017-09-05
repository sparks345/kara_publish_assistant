/**
 * Created by jinjingcao on 2017/9/4.
 */

// let fetch = require('node-fetch');

const RDM_ID = "8ca63999-944b-4628-abfa-e7572ed15146";
const FT_ID = "3968";
const RDM_MAIN_PAGE = "http://rdm.oa.com/ci/product/" + RDM_ID + "/jobs/ft/" + FT_ID;
// http://rdm.oa.com/ci/api/job!getJobList?filterStatus=7,-1&ftId=3968&limit=200&productId=8ca63999-944b-4628-abfa-e7572ed15146&start=0
const CGI = "http://rdm.oa.com/ci/api/job!getJobList";

function init() {
    fetch(CGI)
        .then(function (resp) {
            return resp.json();
        }).then(function (text) {
        console.log(text);
        alert(text);
    });
    // alert("XMF");
};

export {init};