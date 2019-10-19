const fs = require('fs');

var jenkins;

window.createJenkins = (url) => {
    jenkins = require('jenkins')({ baseUrl: url, crumbIssuer: true });
};

window.fetchJobs = function (url) {
    return new Promise((resolve, reject) => {
        jenkins.job.list(function (err, jobs) {
            if (err) {
                reject(err);
            } else if (jobs) {
                resolve(jobs);
            }
        });
    });
}

window.buildJob = function(input) {
    return new Promise((resovle, reject) => {
        jenkins.job.build(input, (err, data) => {
            if (err) reject(err);
            else resovle(data);
        });
    });
}