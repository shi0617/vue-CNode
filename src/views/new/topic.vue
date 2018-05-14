<template>
    <div id="topic" class="clearfix">
        <div id="topic_left">
            <div class="panel">
                <div class="send clearfix" >
                    <router-link :to="{name:'Home'}">
                        主页
                    </router-link>
                    <span>
                        /发布主题
                    </span>
                </div>
                <div class="send_con">
                    <input type='text' id="title" class="title" placeholder="标题字数10字以上" v-model="title">
                    <textarea class='text' v-model="content"></textarea>
                    <input type="submit" value="提交" class="submit" @click="createTopic">
                </div>
            </div>
        </div>
        <div id="topic_right">
            <div class="markdown">
                <div class='head'>
                    <span>
                        Markdown 语法参考
                    </span>
                </div>
                <div class='content'>
                    <p>
                        ### 单行的标题
                    </p>
                    <p>
                        **粗体**
                    </p>
                    <p>
                        `console.log('行内代码')`
                    </p>
                    <p>
                        ```js\n code \n``` 标记代码块
                    </p>
                    <p>
                        [内容](链接)
                    </p>
                    <p>
                        ![文字说明](图片链接)
                    </p>
                </div>
            </div>
            <div class="markdown">
                <div class='head'>
                    <span>
                        话题发布指南
                    </span>
                </div>
                <div class='content'>
                    <p>
                        尽量把话题要点浓缩到标题里
                    </p>
                    <p>
                        代码含义和报错可在 SegmentFault 提问
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                token:'6ad1ca3d-981f-4e6b-9c10-aa5a9871cb5c',
                title:'',
                content:''
            }
        },
        methods:{
            async createTopic(){
                if(this.title.length< 10){
                    alert('标题至少10个字')
                    return
                }else if(this.content==""){
                    alert('请填写主题内容')
                    return
                }
                let {data} = await this.http.postNewTopic({
                                                            tab:'dev',
                                                            accesstoken:this.token,
                                                            title:this.title,
                                                            content:this.content
                                                        })
                if(!data.success) return
                this.$router.push({
                    path:'/detail/'+ data.topic_id,
                    query:{
                        loginname:'shi0617',
                        title:this.title,
                        content:this.content
                    }
                })
                console.log(data)
            }
        },
        mounted(){
            if(this.$route.query){
                this.title=this.$route.query.title
                this.content=this.$route.query.content
            }
            let title = document.getElementById('title')
            title.focus()
        }
    }
    
</script>
<style>
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
    }
    #topic_left .panel .send_con .title{
        margin-bottom: 10px;
        border: 1px solid #e1e1e1;
        height: 30px;
        display: block;
        border-radius: 5px;
        padding-left:5px;
        font: 14px/30px '微软雅黑';
        outline: none;
        width:100%;
    }
    #topic_left .panel .send_con .text{
        margin-bottom: 10px;
        border: none;
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        resize: none;
        width:100%;
        height: 600px;
        font: 14px/30px '微软雅黑';
        outline: none;
    }
    #topic_left .panel .send_con .submit{
        height: 34px;
        color: #fff;
        background-color: #05c;
        padding: 3px 10px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font: 14px/28px '微软雅黑';
    }
    #topic_left .panel .send_con .submit:hover{
        background-color: blue;
    }
    #topic_right .markdown{
        margin-bottom: 10px;
    }
    #topic_right .markdown .head{
        border-bottom: 2px solid #e1e1e1
    }
    #topic_right .markdown .head span{
        display:block;
        padding: 10px;
        font: 14px/20px arial,'微软雅黑';
        color:#444;
        background-color:#f6f6f6;
        border-radius: 3px 3px 0 0;
    }
    #topic_right .markdown .content{
        font: 14px/26px arial,'微软雅黑';
        color:#555;
        background-color:#fff;
        border-radius: 0 0 3px 3px;
        padding: 10px;
    }
    
</style>