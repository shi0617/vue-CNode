<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div id="main" class="clearfix" v-if="!spinShow">
            <div id="content">
                <div class="panel">
                    <div class="head">
                        <span class="title">{{d.title}}</span>
                        <div class="info clearfix">
                            <span>发布于：{{d.create_at.slice(0,10)}}</span>
                            <span>作者：{{d.author.loginname}}</span>
                            <span>浏览人数：{{d.visit_count}}</span>
                            <router-link :to="{name:'Topic',query:this.$route.query}" 
                                class='collect'   
                                v-if="d.author.loginname == 'shi0617'"
                                tag='span'
                            >
                                编辑
                            </router-link>
                            <span class='collect' :class="{color:d.is_collect}"  @click="collectTopic">{{d.is_collect?'取消收藏':'收藏'}}</span>
                        </div>
                    </div>
                    <div v-html="d.content" class="allcon"></div>
                </div>
                <div class="panel">
                    <div class="reply_count">
                        {{d.reply_count}}
                        人回复
                    </div>
                    <div class="all_reply">
                        <div class="reply_list" v-for="item,index in d.replies">
                            <div class="reply_info clearfix">
                                <div class="info_left">
                                    <span><img :src="item.author.avatar_url"/></span>
                                    <span>{{item.author.loginname}}</span>
                                    <span style="color:#08c">{{index + 1}}楼</span>
                                    <span style="color:#08c">{{createTime(item.create_at)}}发布</span>
                                    
                                </div>
                                <div class="info_right">
                                    <span class='ups' @click="upDown(item.id)">赞</span>
                                    <span>{{item.ups.length}}</span>
                                </div>
                            </div>
                            <div v-html="item.content" class="reply_con"></div>
                        </div>
                    </div>
                </div>
                <div class="panel">
                    <div class="add_reply">
                        添加回复
                    </div>
                    <div class="add_con">
                        <textarea v-model="content"></textarea>
                        <button style="display:block" @click = "replyContent">回复</button>
                    </div>
                </div>
            </div>
            <div id="slide">
                <div class='author_info'> 
                    <div class="title">作者</div>
                    <div class="content">
                        <router-link class="clearfix top" :to="{name:'User',params:{name:userData.loginname}}" tag='div'>
                            <img :src="userData.avatar_url"/>
                            <span>{{userData.loginname}}</span>
                        </router-link>
                        
                        <div class="bot">
                            <span class="score">积分：{{userData.score}}</span>   
                        </div>
                        <div class="bot">
                            <span class="score">“这家伙什么也没留下o(╥﹏╥)o”</span>   
                        </div>
                    </div>
                </div>
                <div class='author_info'> 
                    <div class="title">作者其它话题</div>
                    <div class="content">
                        <div class="bot">
                            <span v-if="!userData.recent_topics.length">无</span>
                            <div v-if="userData.recent_topics.length">
                                <router-link 
                                    v-for="item in userData.recent_topics"
                                    :to="{name:'Detail',params:{abc:item.id},query:{loginname:userData.loginname }}" 
                                    tag="span"
                                    :key = 'item.id'
                                >
                                    {{item.title.slice(0,18)}}
                                </router-link>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import topic from '../new/topic'   
    import user from '../user/user'

    export default {
        props: ['abc','loginname'],
        components:{
            topic,
            user
        },
        data(){
            return {
                d: {
                  author: {},
                  create_at:''
                },
                spinShow: true,
                userData:{
                    recent_topics:[]
                },
                token:'6ad1ca3d-981f-4e6b-9c10-aa5a9871cb5c',
                content:''
            }
        },
        watch:{
            $route:{
                handler: 'getNewTopics',
                immediate: true
            }
        },
        methods:{
            createTime(t){
                let y = t.slice(0,4)
                let mon = t.slice(5,7)-1
                let d = t.slice(8,10)
                let h = t.slice(11,13)
                let min = t.slice(14,16)
                let s = t.slice(17,19)
                let time = (Date.now() - new Date(y,mon,d,h,min,s).getTime())/1000
                if(Math.floor(time/(365*24*3600))){
                    return Math.floor(time/(365*24*3600)) + '年前'
                }else if(Math.floor(time/(30*24*3600))){
                    return Math.floor(time/(30*24*3600)) + '个月前'
                }else if(Math.floor(time/(24*3600))){
                    return Math.floor(time/(24*3600)) + '天前'
                }else if(Math.floor(time/3600)){
                    return Math.floor(time/3600) + '小时前'
                }else if(Math.floor(time/60)){
                    return Math.floor(time/60) + '分钟前'
                }else{
                    return '刚刚'
                }
            },
            async getNewTopics(){
                this.spinShow = true;
                let id = this.abc
                let {data} = await this.http.getTopicsById({id,token:this.token})
                this.d = data.data; 
                this.spinShow = false;
                let loginname = this.$route.query.loginname
                let userData = await this.http.getUsers({loginname});
                this.userData = userData.data.data
                console.log(this.d)
            },
            async upDown(id){
                await this.http.postUps({id,token:this.token})
                let {data} = await this.http.getTopicsById({id: this.abc,token:this.token})
                this.d = data.data;
            },
            async replyContent(){
                if(this.content == '') {alert('请输入内容')}
                let data1 =await this.http.postReplies({
                                                            id:this.abc,
                                                            token:this.token,
                                                            content:this.content
                                                        })
                let {data} = await this.http.getTopicsById({id:this.abc,token:this.token})
                this.d = data.data;
                this.content=''
            },
            async collectTopic(){
                if(!this.d.is_collect){
                    await this.http.postCollect({
                                                    id:this.abc,
                                                    token:this.token
                                                })
                }else{
                    await this.http.postNoCollect({
                                                        id:this.abc,
                                                        token:this.token
                                                    })
                }
                let {data} = await this.http.getTopicsById({id:this.abc,token:this.token})
                this.d = data.data;
            }
        },
        computed:{
        }
    }
</script>
<style>
    pre{
        text-indent: 0em;
        padding-left: 2em;
        overflow:hidden;
    }
    ol{
        padding-left: 40px;
        margin:10px 0 10px 25px;
        text-indent: 0;
    }
    ul{
        padding-left: 20px;
        margin:10px 0 10px 25px;
        text-indent: 0;
        list-style: none;
    }
    li ol{
        padding-left: 0px;
    }
    .clearfix:after{
        content:'';
        clear: both;
        display:block;
    }
    #main{
        width: 90%;
        margin: 0 auto;
        padding-top:15px;
    }
    #slide{
        width: 25%;
        float: right;
    } 
    #slide .author_info {
        margin-bottom: 15px;
    }
    #slide .author_info .title{
        padding: 10px;
        font: 14px/14px '微软雅黑';
        background-color:#f6f6f6;
        color: #51585c;
        border-radius: 3px 3px 0 0;
    }
    #slide .author_info .content .top{
        cursor:pointer;
    }
    #slide .author_info .content .top,#slide .author_info .content .bot{
        padding: 10px;
        background-color: #fff;
    }
    #slide .author_info .content .top img{
        width: 30px;
        height: 30px;
        float: left;
        border-radius: 3px;
    }
    #slide .author_info .content .top span{
        float: left;
        font: 14px/30px arial,"微软雅黑";
        margin-left: 10px;
        color: #778087;
    }
    #slide .author_info .content .bot{
        border-radius: 0 0 3px 3px;
    }
    #slide .author_info .content .bot span{
        display: block;
        font: 14px/30px arial,"微软雅黑";
        overflow: hidden;
        width: 100%;
    }
    #slide .author_info .content .bot div span{
        cursor: pointer;
    }
    #slide .author_info .content .bot .score{
        display: block;
        font: 14px/20px arial,"微软雅黑";
    }
    #content{
        width: 70%;
        float: left;
    }
    #content .panel{
        margin-bottom: 10px;
        background-color: #fff;
        border-radius: 3px;
    }
    #content .panel .head{
        padding: 10px;
        border-radius: 3px 3px 0 0;
        border-bottom: 2px solid #e1e1e1;
    }
    #content .panel .title{
        font: 22px/22px arial,"微软雅黑";
        display:block;
        margin: 8px 0;
    }
    #content .panel .info span{
        float: left;
        margin-right: 10px;
        font: 14px/20px arial,'微软雅黑';
        color: #333;
    }
    #content .panel .info .collect{
        float: right;
        color: #fff;
        padding: 4px;
        text-align: center;
        border-radius: 3px;
        font: 12px/12px arial,'微软雅黑';
        background-color: #80bd01;
        cursor: pointer;
    }
    #content .panel .info .color{
        background-color: #e1e1e1;
        color:#000;
    }
    #content .panel .allcon{
        padding: 10px;
        font: 16px/24px arial,'微软雅黑';
        text-indent: 2em;
        border-radius: 0 0 3px 3px;
    }
    #content .panel .allcon img{
        display: block;
        width: 50%;
        margin: 0 auto;
    }
    #content .panel .allcon p{
        margin: 20px 0;
    }
    #content .panel .allcon h1{
        margin: 15px 0 0;
        font: 26px/26px '微软雅黑';
    }
    #content .panel .allcon h2{
        margin: 25px 0 10px;
        font: 20px/20px '微软雅黑';
    }
    #content .panel .reply_count,#content .panel .add_reply{
        font: 16px/24px arial,'微软雅黑';
        padding: 10px;
        border-bottom: 2px solid #e1e1e1;
        background-color:#f1f1f1;
        border-radius: 3px 3px 0 0;
    }
    .all_reply .reply_list{
        padding: 10px;
        border-bottom: 2px solid #e1e1e1;
    } 
    .all_reply .reply_list .reply_con{
        padding-left: 40px;
        font: 16px/20px arial,'微软雅黑';
        margin-top: 10px;
    }
    .all_reply .reply_list .reply_con img{
        display: block;
        width: 50%;
        margin: 10px auto;
    }
    .all_reply .reply_list .reply_info .info_left{
        float:left;
        height: 30px;
    }
    .all_reply .reply_list .reply_info .info_left span{
        float:left;
        margin-right: 10px;
        font: 14px/30px arial,'微软雅黑';
    }
    .all_reply .reply_list .reply_info .info_left img{
        height: 30px;
        width: 30px;
        border-radius: 5px;
    } 
    .all_reply .reply_list .reply_info .info_right{
        float:right;
        width: 80px;
    }
    .all_reply .reply_list .reply_info .info_right span{
        margin-right: 10px;
        font: 16px/30px arial,'微软雅黑';
        color: rgb(0, 136, 204);
    }
    .all_reply .reply_list .reply_info .info_right .ups{
        cursor:pointer;
    }
    #content .panel .add_con{
        padding: 10px;
    }
    #content .panel .add_con textarea{
        width: 100%;
        height: 100px;
        margin-bottom: 10px;
        resize: none;
        font: 14px/20px '微软雅黑';
        border: none;
        outline:none;
    }
    #content .panel .add_con button{
        height: 34px;
        color: #fff;
        background-color: #05c;
        padding: 3px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font: 14px/28px '微软雅黑';
    }
</style>