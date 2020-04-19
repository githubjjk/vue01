import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import index from '@/components/index/index.vue'
import roleList from '@/components/role/roleList.vue'
import adminList from '@/components/user/adminList.vue'
import default1 from '@/components/default1.vue'
import errorPage from '@/components/errorPage.vue'
import treeList from '@/components/role/treeList.vue'
import resList from '@/components/res/resList'

Vue.use(Router)

const myRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [{
        path: '',
        name: 'default1',
        component: default1
      },
      {
        path: 'roleList',
        name: 'roleList',
        component: roleList
      },
      {
        path: 'errorPage',
        name: 'errorPage',
        component: errorPage
      },
      {
        path: 'treeList',
        name: 'treeList',
        component: treeList
      },
      {
        path: "resList",
        name: "resList",
        component: resList
      },
      {
        path: "adminList",
        name: "adminList",
        component: adminList
      }
      ]
    }
  ]
})
myRouter.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
    return
  }
  if (to.matched.length === 0) {
    next('errorPage')
  } else {
    next()
  }
})
export default myRouter
