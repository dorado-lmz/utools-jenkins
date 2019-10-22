Vue.component('app', {
    data() {
        let val = utools.db.get('url');
        return {
            url: val && val.data || '',
            value: '',
            jobs: [],
            selectedLi: 0
        };
    },

    template: `<div class="config" v-if="!url">
        <div class="label">jenkins url:</div>
        <div class="input">
            <input placeholder="格式：http://{username}:{passwd}@{hostname}:{port}, example: http://jack:123@aa.com:8080" v-model="value"/>
        </div>
        <div class="btn" @click="save">保存</div>
    </div><ul class="list" ref="list" v-else>
        <li @click="build(job)" ref="li" v-for="(job, index) of jobs" :class="{selected: selectedLi == index}">
        <span v-if="job.color" class="c-tag" :class="job.color"></span>
        <span class="times" v-if="job.time">{{job.time}}</span>
        {{job.name}}</li>
    </ul>`,

    created() {
        this.initKeyEvent();
        if (this.url) {
            this.initJenkins();
        }
        utools.onPluginEnter(({code, type, payload}) => {
            let args = payload.split(' ')[1] || '';
            this.initJenkins(args);
        })
        utools.onPluginOut(() => {
            utools.removeSubInput();
        })
    },

    methods: {
        save() {
            if (!this.value){
                return;
            } else {
                utools.db.put({_id: 'url', data: this.value})
                this.url = utools.db.get('url').data;
                this.initJenkins();
            }
        },
        build(job) {
            if (!job.time) {
                job.time = 0;
            }
            job.time++;
            buildJob(job.name);
            utools.showNotification(`${job.name} building` );
        },
        initJenkins(args) {
            createJenkins(this.url);
            fetchJobs(this.url).then((jobs) => {
                this.jobs = jobs;
                utools.setSubInput(({text}) => {
                    this.selectedLi = 0;
                    if (!text) {
                        return jobs;
                    }
                    this.jobs = jobs.filter((job) => ~job.name.indexOf(text)).sort((a,b) => (b.time || 0) - (a.time|| 0));
                }, '请输入jenkins任务名');
                if (args) {
                    utools.setSubInputValue(args);
                }
            })

        },

        initKeyEvent() {
            $(document).keydown((e) => {
                let list = this.$refs.list;
                if (!list) {
                    return;
                }
                switch(e.keyCode){
                    case 13:
                        this.build(this.jobs[this.selectedLi]);
                        break;
                    case 38: //上
                        if (this.selectedLi > 0) {
                            this.selectedLi--;
                            document.documentElement.scrollTop = this.$refs.li[this.selectedLi].offsetTop;
                        }
                        break;
                    case 40:  //下
                        if (this.selectedLi < this.$refs.li.length-1) {
                            this.selectedLi++;
                            document.documentElement.scrollTop = this.$refs.li[this.selectedLi].offsetTop;
                        }
                        break;
                }
            });
        }
    }
});