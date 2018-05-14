import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
let routes = [
    { 
        path: '/foo', 
        component: Foo,
        children:[
            {
                path: '', 
                name:'shi',
                component: Shi,
            },
            {
                path: 'bai',
                name:'bai', 
                component: Bai,
            }
        ]
    },
    {   path: '',
        name:'bar', 
        component: Bar 
    }
]
let router = new VueRouter({
    routes
})
export default router