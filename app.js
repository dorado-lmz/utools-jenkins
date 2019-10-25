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
        <div class="op">
            <span class="iconfont" v-if="job.url" @click.stop="go(job.url)">&#xe652;</span>
            <span class="iconfont" @click.stop="(e) => fav(job, e)">&#xe61a;</span>
            <span class="iconfont" @click.stop="stop(job)">&#xe671;</span>
            <span class="iconfont" @click.stop="remove(job)">&#xe699;</span>
        </div>
        {{job.name}}</li>
    </ul>`,

    created() {
        this.initKeyEvent();
        if (this.url) {
            this.initJenkins();
        }
        utools.onPluginEnter(({code, type, payload}) => {
            let val = utools.db.get('url');
            this.url = val && val.data || '';
            let args = payload.split(' ')[1] || '';
            this.initJenkins(args);
        })
        utools.onPluginReady(() => {
            startTimerTask();
        });
        utools.onPluginDetach(() => {
            stopTimerTask();
        });
        utools.onPluginOut(() => {
            utools.removeSubInput();
        })
    },

    methods: {
        go(url) {
            openBrowser(url);
        },
        remove(job) {
            removeJob(job);
            utools.showNotification(`${job.name} 删除成功` );
        },
        stop(job) {

        },
        fav(job, e) {
            let target = e.target;
            if (target) {
                target.setAttribute('style', `color: ${job.fav ? 'auto' : 'red'}`)
                job.fav = !job.fav;
            }

        },
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
                    this.jobs = jobs.filter((job) => ~job.name.indexOf(text));
                }, '请输入jenkins任务名');
                if (args) {
                    if (args === 'clear') {
                        clear();
                        utools.showNotification('缓存已清除');
                    } else if (args === 'config') {
                        this.value = this.url;
                        this.url = '';
                    }else {
                        utools.setSubInputValue(args);
                    }

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
                        e.preventDefault();
                        if (this.selectedLi > 0) {
                            this.selectedLi--;
                            let offsetTop = this.$refs.li[this.selectedLi].offsetTop;
                            if (offsetTop > 160) {
                                document.documentElement.scrollTop = offsetTop - 160;
                            }
                        }
                        break;
                    case 40:  //下
                        e.preventDefault();
                        if (this.selectedLi < this.$refs.li.length-1) {
                            this.selectedLi++;
                            let offsetTop = this.$refs.li[this.selectedLi].offsetTop;
                            if (offsetTop > 160) {
                                document.documentElement.scrollTop = offsetTop - 160;
                            }
                        }
                        break;
                }
            });

            $(document).scroll((e) => {

            });
        }
    }
});