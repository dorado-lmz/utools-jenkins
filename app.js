Vue.component('app', {
    data() {
        let val = utools.db.get('url');
        return {
            url: val && val.data || '',
            value: '',
            jobs: []
        };
    },

    template: `<div class="main" v-if="!url">jenkins url:
        <input v-model="value"/>
        <button @click="save">保存</button>
    </div><ul v-else>
        <li @click="build(job)" v-for="job of jobs">{{job.result}}{{job.name}}</li>
    </ul>`,

    methods: {
        save() {
            if (!this.value){
                return;
            } else {
                utools.db.put({_id: 'url', data: this.value})
                this.url = utools.db.get('url').data;
                createJenkins(this.url);
                utools.setSubInput(async ({text}) => {
                    await fetchJobs(this.url).then((jobs) => {
                        this.jobs = jobs.map((job) => {
                            job.result = {};
                            return job;
                        });
                    })
                    return this.jobs;
                }, 'jenkins')

            }
        },
        build(job) {
            buildJob(job.name).then((data) => {
                job.result = data;
            });
        }
    }
});