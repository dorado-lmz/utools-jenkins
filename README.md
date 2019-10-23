# jekins 管理

utools 插件 —— 用户在macOS中输入jenkins 任务名，直接部署。

>jenkins 官方提供了Web管理系统，方便进行任务部署。由于本人在日常开发中，经常需要修改并部署多个jenkins项目，频繁打开浏览器，效率不高。
使用这个小工具， 你只需要在utools输入框中输入jk, 回车结束。utools展示了你的所有jenkins项目，然后通过up/down进行上下导航或者输入keyword进行模糊匹配。

## 使用方法

1. 输入jk

    此时展示所有的jenkins jobs列表，点击其中一项（或者使用回车），自动进行部署。

    1. 每个job项包含：**状态**（红点：fail, 蓝点：成功）, **部署次数**(*斜体显示的数字*)， **job名称**， **web地址**。
    2. 支持模糊搜索，通过down/up按键上下导航，回车之后，会发送消息通知Jenkins部署 高亮文字对应的job。
    3. 每次部署，该job的优先级变高，下次模糊检索时，会出现在最前面。随着你的深入使用，会越来越好用😁

    ![](https://tva1.sinaimg.cn/large/006y8mN6ly1g888wzkwcxg30go0c0b2o.gif)

2. 输入jk + {空格} + {jobname}

   执行搜索该jobname

   ![](https://tva1.sinaimg.cn/large/006y8mN6ly1g889717rrng30go08ukjw.gif)



## 反馈

https://github.com/dorado-lmz/utools-jenkins/issues

