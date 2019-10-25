const fs = require('fs');
const browser = require('openurl');
const Sort = require('./sort');

var jenkins;
const _job_top10 = [];
const _jobRuningQueue = [
    () => {
        if (_jobs.length) {
            _jobs = Sort.resort(_jobs);
        }
    }
];
var _jobs;

window.createJenkins = (url) => {
    jenkins = require('jenkins')({ baseUrl: url, crumbIssuer: true, promisify: true });
};

window.fetchJobs = function (url) {
    if (_jobs) {
        return Promise.resolve(_jobs);
    }
    return jenkins.job.list().then((jobs) => {
        _jobs = jobs.sort((a,b) => {
            let aPrefix = a.name.indexOf('qiyihao'),
                bPrefix = b.name.indexOf('qiyihao');
            return ~aPrefix - ~bPrefix;
        }).map(job => {
            job.time = 0;
            return job;
        });
        return _jobs;
    });
}

window.buildJob = function(input) {
    // _job_top10
    return jenkins.job.build(input);
}

window.clear = function() {
    _jobs = null;
}

window.startTimerTask = function() {
    _jobRuningQueue.handler = setInterval(() => {
        _jobRuningQueue.forEach((item) => {
            item.apply(null);
        });
    }, 1000 * 10 * 60);
}

window.stopTimerTask = function() {
    if (_jobRuningQueue.handler) {
        clearInterval(_jobRuningQueue.handler);
    }
}


window.openBrowser = function(url) {
    browser.open(url);
}

window.removeJob = function(job) {
    let index = _jobs.indexOf(job);
    if (~index) {
        _jobs.splice(index, 1);
    }
}

window.addQueue = function(job, id) {
    let _runingJob = {
        timestamp: Date.now(),
        fn: () => new Promise ((resolve, reject) => {
                jenkins.build.get(job.name, 1, (err, data) => {
                    if (err) reject(err);
                    else resolve(job, data);
                })
        })
    };
    // _jobQueue.push(_runingJob);
    return _runingJob;
}

function runJobQueue() {
    _jobQueue.map((job) => {
        job.fn().then((job, data) => {
            job.result = data;
            job.color = data.color;
        }).catch(() => {

        })
    });
}