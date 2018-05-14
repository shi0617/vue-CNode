<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div id="topic" class="clearfix" v-if="!spinShow">
            <div id="topic_left">
                <div class="panel">
                    <div class="send clearfix" >
                        <router-link :to="{name:'Home'}">
                            主页
                        </router-link>
                        <span>
                            /
                        </span>
                    </div>
                    <div class="send_con">
                        <div class="info">
                            <img :src="userData.avatar_url">
                            <span>{{userData.loginname}}</span>
                        </div>
                        <div>{{userData.score?userData.score:0}}积分</div>
                        <div v-if="userData.githubUsername">GitHub:@{{userData.githubUsername}}</div>
                        <div>注册时间:{{userData.create_at.slice(0,10)}}</div>
                    </div>
                </div>
                <div class="panel">
                    <div class="send clearfix" >
                        <span>
                        最近新建的话题
                        </span>
                    </div>
                    <ul id='list'>
                        <li v-for="item in userData.recent_topics" 
                            :key="item.id"
                        >
                            <router-link class="info" :to="{name:'User',params:{name:item.author.loginname}}">
                                <img :src="item.author.avatar_url">
                            </router-link>
                            <router-link 
                                :to="{name:'Detail',params:{abc:item.id},query:{loginname:item.author.loginname }}" 
                                active-class='title'
                            >
                                {{item.title}}
                            </router-link>
                            <span class="author">
                                作者：{{item.author.loginname}}
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="panel">
                    <div class="send clearfix" >
                        <span>
                            最近参与的话题
                        </span>
                    </div>
                    <ul id='list_other'>
                        <li v-for="item in userData.recent_replies" 
                            :key="item.id"
                        >
                            <router-link class="info" :to="{name:'User',params:{name:item.author.loginname}}">
                                <img :src="item.author.avatar_url">
                            </router-link>
                            <router-link 
                                :to="{name:'Detail',params:{abc:item.id},query:{loginname:item.author.loginname }}" 
                                active-class='title'
                            >
                                {{item.title}}
                            </router-link>
                            <router-link class="author" :to="{name:'User',params:{name:item.author.loginname}}" tag="span">
                                作者：{{item.author.loginname}}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="topic_right">
                <div class='author_info'> 
                    <div class="title">作者</div>
                    <div class="content">
                        <div class="clearfix top">
                            <img :src="userData.avatar_url"/>
                            <span>{{userData.loginname}}</span>
                        </div>
                        <div class="bot">
                            <span class="score">积分：{{userData.score}}</span>   
                        </div>
                        <div class="bot">
                            <span class="score">“这家伙什么也没留下o(╥﹏╥)o”</span>   
                        </div>
                    </div>
                </div>
                <div class='author_info'> 
                    <div class="title">客户端二维码</div>
                    <div class="content">
                        <img src="//dn-cnode.qbox.me/FtG0YVgQ6iginiLpf9W4_ShjiLfU" style="width: 80%;height:80%;display:block;margin: 0 auto;">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                userData:{
                    recent_topics:[],
                    create_at:''
                },
                spinShow: true,
            }
        },
        methods:{
            async getUserInfo(){
                let loginname = this.$route.params.name
                let userData = await this.http.getUsers({loginname});
                this.userData = userData.data.data
                this.spinShow = false
                console.log(this.userData)
            }
        },
        watch:{
            $route:{
                handler: 'getUserInfo',
                immediate: true
            }
        },
    }
</script>
<style>
    #list,#list_other{
        padding: 0;
        margin: 0;
        list-style: none;
        width: 100%;
    }
    #list li,#list_other li{
        height: 50px;
        padding: 10px;
        border-top: 1px solid #f0f0f0;
        background-color: #fff;
        overflow:hidden;
    }
    #list li:nth-child(1),#list_other li:nth-child(1){
        border-top: none;
    }
    #list li .info,#list_other li .info{
        float:left;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        cursor:pointer;
        margin-right: 10px;
    }
    #list li .info img,#list_other li .info img{
        width: 30px;
        height: 30px;
        border-radius: 5px;
    }
    #list li .reply,#list_other li .reply{
        font: 18px/30px arial;
        color:#9e78c0;
    }
    #list li .visit,#list_other li .visit{
        font: 14px/30px arial;
        color:#000;
    }
    #list li a,#list_other li a{
        font: 16px/30px arial,'微软雅黑';
        height: 30px;
        width: 600px;
        color:#333;
        float: left;
        overflow:hidden;
        cursor:pointer;
    }
    #list li a:visited,#list_other li a:visited{
        color:#a1a1a1;
    }
    #list li:hover,#list_other li:hover{
        background-color:#f1f1f1;
    }
    #list li a:hover,#list_other li a:hover{
        color:red;
        text-decoration:underline;
    }
    #list li .author,#list_other li .author{
        font: 14px/30px arial,'微软雅黑';
        color:rgb(0, 136, 204);
        cursor:pointer;
    }
    #list li  .author:hover,#list_other li  .author:hover{
        color:red;
        text-decoration:underline;
    }
    .clearfix:after{
        content:'';
        clear: both;
        display:block;
    }
    #topic{
        width: 90%;
        margin: 0 auto;
        padding-top:15px;
    }
    #topic_right{
        width: 25%;
        float: right;
    } 
    #topic_left{
        width: 70%;
        float: left;
    }
    #topic_left .panel{
        margin-bottom: 10px;
        background-color: #fff;
        border-radius: 3px;
    }
    #topic_left .panel .send{
        padding: 10px;
        background-color: #f6f6f6;
        border-radius: 3px 3px 0 0 ;
        border-bottom: 2px solid #e1e1e1;
    }
    #topic_left .panel .send a,
    #topic_left .panel .send span{
        float: left;
        font: 14px/20px '微软雅黑';
    }
    #topic_left .panel .send a{
        color: #80bd01;
    }
    #topic_left .panel .send span{
        color: #999;
    }
    #topic_left .panel .send_con{
        padding: 10px;
        color: #444;
        font: 14px/30px arial,'微软雅黑'; 
    }
    #topic_left .panel .send_con .info{
        height: 30px;
        margin-bottom: 5px;
    }
    #topic_left .panel .send_con .info img{
        float:left;
        width: 30px;
        height: 30px;
        border-radius: 3px;
        margin-right: 10px; 
    }
    #topic_left .panel .send_con .info span{
        float:left;
    }
    #topic_right .markdown{
        margin-bottom: 10px;
    }
     #topic_right .author_info {
        margin-bottom: 15px;
    }
    #topic_right .author_info .title{
        padding: 10px;
        font: 14px/14px '微软雅黑';
        background-color:#f6f6f6;
        color: #51585c;
        border-radius: 3px 3px 0 0;
    }
    #topic_right .author_info .content .top,#topic_right .author_info .content .bot{
        padding: 10px;
        background-color: #fff;
    }
    #topic_right .author_info .content .top img{
        width: 30px;
        height: 30px;
        float: left;
        border-radius: 3px;
    }
    #topic_right .author_info .content .top span{
        float: left;
        font: 14px/30px arial,"微软雅黑";
        margin-left: 10px;
        color: #778087;
    }
    #topic_right .author_info .content .bot{
        border-radius: 0 0 3px 3px;
    }
    #topic_right .author_info .content .bot span{
        display: block;
        font: 14px/30px arial,"微软雅黑";
        overflow: hidden;
        width: 100%;
    }
    #topic_right .author_info .content .bot div span{
        cursor: pointer;
    }
    #topic_right .author_info .content .bot .score{
        display: block;
        font: 14px/20px arial,"微软雅黑";
    }
    #topic_right .author_info .content{
        background-color:#fff;
        padding:15px 0;
        border-radius: 0 0 3px 3px ;
    }
    
</style>