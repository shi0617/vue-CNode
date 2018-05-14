<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu 
                  @on-select="selectMenu" 
                  :active-name="activeClass" 
                  theme="dark" 
                  width="auto"
                >
                    <MenuItem :key="item.name" v-for="item in menusData" :name="item.name">
                        <Icon :type="item.icon"></Icon>
                        <span>{{item.title}}</span>
                    </MenuItem>
                </Menu>
                <div class="new_topic">
                    <router-link :to="{name:'Topic'}">发布话题</router-link>
                </div>
            </Sider>
            <Layout>
                <Content :style="{padding: '16px',position:'relative'}">
                    <Spin size="large" fix v-if="spinShow"></Spin>
                    <ul id='list'>
                        <li v-for="item in list" 
                            :key="item.id"
                        >
                            <router-link class="info" :to="{name:'User',params:{name:item.author.loginname}}">
                                <img :src="item.author.avatar_url">
                            </router-link>
                            <span class="replyVisit">
                                <span class="reply">{{item.reply_count}}</span>
                                <span class="visit">/</span>
                                <span class="visit">{{item.visit_count}}</span>
                            </span>
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
                    <Page 
                        :current='page' 
                        @on-change='changePage' 
                        :total="500" v-if="!spinShow"
                        class-name="center"
                    ></Page>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import {menusData} from './menu-data.js'
    import detail from '../topic/detail'
    import topic from '../new/topic'
    import user from '../user/user'

    export default {
        components:{
            detail,
            topic,
            user
        },
        data () {
            return {
                isCollapsed: false,
                menusData,
                list: [],
                activeClass: 'all',
                spinShow: true,
                page: 1
            };
        },
        methods:{
            selectMenu(name){
                this.$router.push({
                    query:{
                        tab:name
                    }
                })
            },
            changePage(page){

                this.$router.push({
                    query:{
                        ...this.$route.query,
                        page
                    }
                })

                this.fetchTopic({page: page})

                // 在地址栏记录

            },
            async fetchTopic(params={page:1}){
                let tab = this.$route.query.tab || 'all';
                let page = params.page || this.$route.query.page || 1;
                this.activeClass = tab;
                this.spinShow = true;
                this.page = parseInt(page);
                let {data} = await this.http.getTopics({
                    tab,
                    page:page,
                    limit: 10
                })
                this.list = data.data;
                this.spinShow = false;
                console.log(this.list)
            }
        },
        watch:{
            $route:{
                handler: 'fetchTopic',
                immediate: true
            }
        }
    }
</script>
<style scoped>
    .new_topic a{
        padding: 14px 24px;
        cursor: pointer;
        display: block;
        outline: 0;
        font-size: 14px;
        color: rgba(255,255,255,.7)
    }
    .new_topic a:hover{
        background: #363e4f;
        color:#2d8cf0;
    }
    .layout-con{
        height: 100%;
        width: 100%;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    #list{
        padding: 0;
        margin: 0;
        list-style: none;
        width: 100%;
    }
    #list li{
        height: 50px;
        padding: 10px;
        border-top: 1px solid #f0f0f0;
        background-color: #fff;
        overflow:hidden;
    }
    #list li:nth-child(1){
        border-top: none;
    }
    #list li .info{
        float:left;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        cursor:pointer;
    }
    #list li .info img{
        width: 30px;
        height: 30px;
        border-radius: 5px;
    }
    #list li .replyVisit{
        float:left;
        width: 100px;
        height: 30px;
        text-align: center;
    }
     #list li .replyVisit span{
        display: inline-block;
     }

    #list li .reply{
        font: 18px/30px arial;
        color:#9e78c0;
    }
    #list li .visit{
        font: 14px/30px arial;
        color:#000;
    }
    #list li a{
        font: 16px/30px arial,'微软雅黑';
        height: 30px;
        width: 800px;
        color:#333;
        float: left;
        overflow:hidden;
        cursor:pointer;
    }
    #list li a:visited{
        color:#a1a1a1;
    }
    #list li:hover{
        background-color:#f1f1f1;
    }
    #list li a:hover{
        color:red;
        text-decoration:underline;
    }
    #list li  .author{
        font: 14px/30px arial,'微软雅黑';
        color:rgb(0, 136, 204);
        cursor:pointer;
    }
    #list li  .author:hover{
        color:red;
        text-decoration:underline;
    }
    .center{
        margin: 20px 0;
        text-align: center;
    }
</style>

