/**
 * Created by jinjingcao on 2017/9/4.
 */


import * as React from "react";
import * as ReactDom from "react-dom";

const path = require('path');
const cookie = require(__app_root + "/dist/lib/cookie.js");
const PRODUCT_ID = "8ca63999-944b-4628-abfa-e7572ed15146";
const FT_ID = "3968";

const RDM_MAIN_PAGE = "http://rdm.oa.com/ci/product/" + PRODUCT_ID + "/jobs/ft/" + FT_ID;

// http://rdm.oa.com/ci/api/job!getJobList?filterStatus=7,-1&ftId=3968&limit=200&productId=8ca63999-944b-4628-abfa-e7572ed15146&start=0
const CGI_GET_JOB_LIST = "http://rdm.oa.com/ci/api/job!getJobList";

// http://rdm.oa.com/ci/api/build!getLastBuildDetail?jobId=42366
const CGI_GET_LAST_BUILD = "http://rdm.oa.com/ci/api/build!getLastBuildDetail";

// http://rdm.oa.com/ci/api/download?busType=JobArtifactDownload&packageId=25975848&buildId=b0d8d998-f26f-41f5-be3f-d221437d322e


const jobs_cot = $("jobs_cot");
const artifacts_cot = $("artifacts_cot");

const down_operator_tip = $("down_operator_tip");
const sel_apks = $("sel_apks");
const sel_none = $("sel_none");
const sel_to_next = $("sel_to_next");


/**
 * job list
 */
class RDMJobManager extends React.Component {
    constructor(props) {
        super(props);
        this.list = props.list;
    }

    render() {
        // debugger
        return (
            <div>
                {
                    this.list.map(function (job) {
                        // debugger
                        return <RDMJob data={job} key={job.id}/>
                    })
                }
            </div>
        );
    }
}

class RDMJob extends React.Component {
    constructor(props) {
        super(props);
        this.name = props.data.name;
        this.id = props.data.id;

        this.loadDetail = this.loadDetail.bind(this);
    }

    render() {
        return (
            <div className="rdm-job" onClick={this.loadDetail}>
                <h3>{this.name}</h3>
            </div>
        )
    }

    loadDetail(rdmTask) {
        console.warn("::", rdmTask);
        let id = this.id;
        loadArtifacts(id);
    }
}

/**
 * artifact task
 */
class ArtifactManager extends React.Component {
    constructor(props) {
        super(props);
        this.list = props.list;
    }

    render() {
        return (
            <div>
                {
                    this.list.map(function (artifact) {
                        // debugger
                        return <Artifact data={artifact} key={artifact.packageId}/>
                    })
                }
            </div>
        )
    }
}

class Artifact extends React.Component {
    constructor(props) {
        super(props);
        this.packageId = props.data.packageId;
        this.name = props.data.fileName;
        this.sha = props.data.sha;
        this.size = props.data.size;
    }

    render() {
        return (
            <div>
                <label className="rdm-artifact"> <input type="checkbox"/> {this.name} </label>
            </div>
        )
    }
}

function loadJobs(productId, ftId) {
    // const jobs_cot = $("jobs_cot");

    ReactDom.unmountComponentAtNode(jobs_cot);
    ReactDom.render(<div>loading...</div>, jobs_cot);

    let param = [
        ["filterStatus", "7,-1"].join("="),
        ["limit", 200].join("="),
        ["start", 0].join("="),
        ["productId", productId].join("="),
        ["ftId", ftId].join("=")
    ].join("&");

    let head = new Headers();
    // debugger;
    let cookieStr = cookie.parseAvailable(".oa.com");
    head.append("Cookie", cookieStr);
    // head.append('X-my-header', 'my-header');

    fetch(CGI_GET_JOB_LIST + "?" + param, {
        credentials: 'include',// IMPORTANT, For CORS requests, use the "include" value to allow sending credentials to other domains, optional 'same-origin'
        headers: head
    }).then(function (resp) {
        return resp.json();
    }).then(function (json) {
        console.log(json);
        if (json != null && json.data != null && json.errno == 0) {
            let list = json.data.list;
            ReactDom.render(<RDMJobManager list={list}/>, jobs_cot);
        }
    });
}

function loadArtifacts(id) {
    // alert(id);
    // const artifacts_cot = $("artifacts_cot");
    ReactDom.unmountComponentAtNode(artifacts_cot);
    ReactDom.render(<div>loading...</div>, artifacts_cot);

    let param = [
        ["jobId", id].join("=")
    ].join("&");

    let head = new Headers();
    // debugger;
    let cookieStr = cookie.parseAvailable(".oa.com");
    head.append("Cookie", cookieStr);

    fetch(CGI_GET_LAST_BUILD + "?" + param, {
        credentials: 'include',// IMPORTANT, For CORS requests, use the "include" value to allow sending credentials to other domains, optional 'same-origin'
        headers: head
    }).then(function (resp) {
        return resp.json();
    }).then(function (json) {
        console.log(json);
        if (json != null && json.data != null && json.errno == 0) {
            let list = json.data.artifactList;
            ReactDom.unmountComponentAtNode(artifacts_cot);
            ReactDom.render(<ArtifactManager list={list}/>, artifacts_cot);

            onArtifactsLoaded(list);
        }
    });
}

function onArtifactsLoaded(list) {
    // down_operator_tip
    if (list.length > 0) {
        sel_apks.disabled = false;
        sel_none.disabled = false;
    }
}


function initView() {
    ReactDom.unmountComponentAtNode(jobs_cot);
    ReactDom.unmountComponentAtNode(artifacts_cot);

    ReactDom.render(<div className="empty"><p><span>请选择构建任务</span></p></div>, artifacts_cot);

    sel_apks.disabled = true;
    sel_none.disabled = true;
    sel_to_next.disabled = true;
}

function initData() {
    loadJobs(PRODUCT_ID, FT_ID);
}

function init() {

    initView();

    initData();

};


export {init};