import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
//获取组件的方法
const _import = require('./router/_import_' + process.env.NODE_ENV)
// const _import = require('./router/_import_production')
import Layout from '@/layout'
import routerview from './views/routerView'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  // document.title = getPageTitle(to.meta.title)

  // 登录后的用户有token
  const hasToken = getToken()
  // const hasToken = true

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录的用户，想去登录页就重定向到首页
      // next({ path: '/' })
      next()
      NProgress.done()
    } else {
      
      // debugger
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      
      if (hasRoles) {
        next()
      } else {
        try {
          // 登录后获取用户角色
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          // // 根据角色遍历出来对应可以显示的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 通过addRoutes加载路由
          router.addRoutes(accessRoutes)

          // await store.dispatch('user/getInfo')
          // if (store.getters.menus.length < 1) {
          //   //  global.antRouter = []
          //     store.getters.menus = []
          //     next()
          // }
          // const menus = await filterAsyncRouter(store.getters.menus) // 1.过滤路由
          // router.addRoutes(menus) // 2.动态添加路由

          
          //  global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作 可不要

          // hack方法 确保addRoutes已完成 ,set the replace
          next({ ...to, replace: true })
        } catch (error) {
          // 清除token重新跳转登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 白名单直接里边请
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 其他无权限的重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})


// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      }else if(route.component === 'routerView'){
        route.component = routerview //历史遗留，必须有
      } else {
        route.component = _import(route.component) // 导入组件
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
 
   return accessedRouters
 }



router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
