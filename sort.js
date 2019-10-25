module.exports = {
    resort(jobs) {
        let usedJobs = jobs.filter((job) => job.time).sort((a,b) => {
            if ((a.fav>>>0) ^ (b.fav>>>0)) {
                return a.fav ? -1 : 1;
            }
            return b.time - a.time;
        });
        return usedJobs.concat(jobs.filter(job => !job.time));
    }
};