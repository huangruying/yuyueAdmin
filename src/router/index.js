import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    name: 'default',
    path: '/',
    // 默认打开登录页
    redirect: { path: '/login' }
  },
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/index',
    name: 'index',
    component: Layout,
    meta: { title: '首页'},
    hidden: true, // 首页不在侧边栏上
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: '_dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页'}
      }
    ]
  },
  {
    component: Layout,
    path: 'marketingOrder',
    name: 'marketingOrder',
    // hidden: true, // 不在侧边栏线上 
    // component: () => import('@/views/marketingOrder/index'),
    // meta: { title: '收费订单管理' },
    children: [
      {
        path: '/marketingOrder',
        name: 'marketingOrder',
        hidden: true, // 不在侧边栏线上
        component: () => import('@/views/marketingOrder/index'),
        meta: { title: '收费订单管理' , activeMenu: '/service/marketing/marketingCertificate/marketingOrderCharge'}
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/autoWash',
  //   component: Layout,
  //   meta: { title: '车后服务管理后台', icon: 'bug' , roles: ['vsadm'] },
  //   children: [
  //     {
  //       path: 'indent',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       // redirect: 'annual',
  //       meta: { title: '订单管理', icon: 'excel' , roles:['vsadm_serviceorder']},
  //       children: [
  //         {
  //           path: 'annual',
  //           name: 'annual',
  //           component: () => import('@/views/annual/index'),
  //           meta: { title: '年检订单' , roles:['vsadm_serviceorder_yearly']}
  //         },
  //         {
  //           path: 'serve',
  //           name: 'serve',
  //           component: () => import('@/views/serve/index'),
  //           meta: { title: '服务订单' , roles:['vsadm_serviceorder_order']}
  //         }
  //       ]
  //     },
  //     {
  //       path: '/nodeList',
  //       alwaysShow: true,
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '网点管理', icon: 'example' , roles: ['vsadm_servicer']},
  //       children: [
  //         {
  //           path: 'nodeList',
  //           name: 'nodeList',
  //           component: () => import('@/views/nodeList/index'),
  //           meta: { title: '网点列表' , roles: ['vsadm_servicer_list']}
  //         },
  //         {
  //           path: 'nodeAudit',
  //           name: 'nodeAudit',
  //           component: () => import('@/views/nodeAudit/index'),
  //           meta: { title: '网点审批' , roles: ['vsadm_servicer_audit']}
  //         },
  //         {
  //           path: 'account',
  //           name: 'account',
  //           component: () => import('@/views/account/index'),
  //           meta: { title: '网点账号管理' , roles: ['vsadm_servicer_account']}
  //         },
  //         {
  //           path: 'institution',
  //           name: 'institution',
  //           component: () => import('@/views/institution/index'),
  //           meta: { title: '所属机构管理' , roles: ['vsadm_servicer_mechanism']}
  //         },
  //       ]
  //     },
  //     {
  //       path: '/basics',
  //       alwaysShow: true,
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '基础数据管理', icon: 'chart' , roles: ['vsadm_basedata'] },
  //       children: [
  //           {
  //             path: 'nodeService',
  //             name: 'nodeService',
  //             component: () => import('@/views/nodeService/index'),
  //             meta: { title: '网点服务项管理', roles: ['vsadm_servicer_list']}
  //           },
  //       ]
  //     },
  //     // {
  //     //   path: '/audit',
  //     //   alwaysShow: true,
  //     //   component: () => import('@/views/routerView/index'), // Parent router-view
  //     //   meta: { title: '核销管理', icon: 'example' },
  //     //   children: [
  //     //     {
  //     //       path: 'audit',
  //     //       name: 'audit',
  //     //       component: () => import('@/views/audit/index'),
  //     //       meta: { title: ' 核销统计', icon: 'table' }
  //     //     }
  //     //   ]
  //     // },
  //     {
  //       path: '/volume',
  //       alwaysShow: true,
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '劵码管理', icon: 'clipboard' , roles: ['vsadm_code']},
  //       children: [
  //         {
  //           path: 'volumeList',
  //           name: 'volumeList',
  //           component: () => import('@/views/volumeList/index'),
  //           meta: { title: '劵码列表', roles: ['vsadm_code_list']}
  //         }
  //       ]
  //     },
  //     {
  //       path: '/priceControl',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '价格管理', icon: 'money' , roles: ['vsadm_price']},
  //       children: [
  //         {
  //           path: 'channelPrice', 
  //           name: 'channelPrice',
  //           component: () => import('@/views/channelPrice/index'),
  //           meta: { title: '渠道价格' , roles: ['vsadm_channel_price']}
  //         },
  //         {
  //           path: 'platformPrice', 
  //           name: 'platformPrice',
  //           component: () => import('@/views/platformPrice/index'),
  //           meta: { title: '平台价格' , roles: ['vsadm_servicer_price']}
  //         }
  //       ]
  //     },
  //     {
  //       path: '/reconciliation',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '对账管理', icon: 'form' , roles: ['vsadm_reconciliation']},
  //       children: [
  //         // {
  //         //   path: 'channel',
  //         //   name: 'channel',
  //         //   component: () => import('@/views/channel/index'),
  //         //   meta: { title: '渠道管理', icon: 'table' }
  //         // },
  //         {
  //           path: 'nodeReconciliation',
  //           name: 'nodeReconciliation',
  //           component: () => import('@/views/nodeReconciliation/index'),
  //           meta: { title: '网点对账' , roles: ['vsadm_servicer_account']}
  //         },
  //         {
  //           path: 'insuranceReconciliation',
  //           name: 'insuranceReconciliation',
  //           component: () => import('@/views/insuranceReconciliation/index'),
  //           meta: { title: '渠道对账' , roles: ['vsadm_chennel_account']}
  //         }
  //       ]
  //     },
  //   ]
  // },
  // {
  //   path: '/service',
  //   component: Layout,
  //   meta: { title: '贵宾厅管理后台', icon: 'tree' , roles:  ['vipadm'] },
  //   children: [
  //     {
  //       path: 'service',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '服务商', icon: 'people'},
  //       children: [
  //         {
  //           path: 'serviceProduct',
  //           name: 'serviceProduct',
  //           component: () => import('@/views/serviceProduct/index'),
  //           meta: { title: '服务商产品管理'}
  //         },
  //         {
  //           path: 'serviceOrder',
  //           name: 'serviceOrder',
  //           component: () => import('@/views/serviceOrder/index'),
  //           meta: { title: '服务单管理'}
  //         },
  //         {
  //           path: 'yuetuSite',
  //           name: 'yuetuSite',
  //           component: () => import('@/views/yuetuSite/index'),
  //           meta: { title: '悦途站点管理'}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'ditch',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '渠道', icon: 'international'},
  //       children: [
  //         // {  贵宾厅与洗车渠道已合并，页面依然保留，日后有需要可打开！
  //         //   path: 'ditchChannel',
  //         //   name: 'ditchChannel',
  //         //   component: () => import('@/views/ditchChannel/index'),
  //         //   meta: { title: '渠道管理', icon: 'dashboard' ,}
  //         // },
  //         {
  //           path: 'ditchProduct',
  //           name: 'ditchProduct',
  //           component: () => import('@/views/ditchProduct/index'),
  //           meta: { title: '渠道产品管理'}
  //         },
  //         {
  //           path: 'ditchOrder',
  //           name: 'ditchOrder',
  //           component: () => import('@/views/ditchOrder/index'),
  //           meta: { title: ' 渠道订单管理'}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'marketing',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       meta: { title: '营销工具', icon: 'tree-table'},
  //       children: [
  //         {
  //           path: 'marketingCoupon',
  //           name: 'marketingCoupon',
  //           component: () => import('@/views/routerView/index'),
  //           meta: { title: '优惠券管理', icon: 'skill'},
  //           children: [
  //             {
  //               path: 'marketingList',
  //               name: 'marketingList',
  //               component: () => import('@/views/marketingList/index'),
  //               meta: { title: '优惠券列表'}
  //             },
  //             {
  //               path: 'marketingGet',
  //               name: 'marketingGet',
  //               component: () => import('@/views/marketingGet/index'),
  //               meta: { title: '优惠券领取表'}
  //             }
  //           ]
  //         },
  //         {
  //           path: 'marketingCertificate',
  //           name: 'marketingCertificate',
  //           component: () => import('@/views/routerView/index'),
  //           meta: { title: '兑换券管理', icon: 'documentation'},
  //           children: [
  //             {
  //               path: 'marketingConvert',
  //               name: 'marketingConvert',
  //               component: () => import('@/views/marketingConvert/index'),
  //               meta: { title: '券码管理'}
  //             },
  //             {
  //               path: 'marketingOrderCharge',
  //               name: 'marketingOrderCharge',
  //               component: () => import('@/views/marketingOrderCharge/index'),
  //               meta: { title: '订单管理'} // 不收费
  //             },
  //             {
  //               path: 'marketingOrder',
  //               name: 'marketingOrder',
  //               hidden: true, // 不在侧边栏线上 
  //               component: () => import('@/views/marketingOrder/index'),
  //               meta: { title: '收费订单管理', activeMenu: '/service/marketing/marketingCertificate/marketingOrderCharge' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'giveCard',
  //           name: 'giveCard',
  //           component: () => import('@/views/giveCard/index'),
  //           meta: { title: '发放会员卡', icon: 'qq'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'WxDeploy',
  //       component: () => import('@/views/routerView/index'), // Parent router-view
  //       alwaysShow: true,
  //       meta: { title: '微信配置', icon: 'wechat'},
  //       children: [
  //         // {
  //         //   path: 'WxBasic',
  //         //   name: 'WxBasic',
  //         //   component: () => import('@/views/WxBasic/index'),
  //         //   meta: { title: '基本配置', icon: 'dashboard' ,}
  //         // },
  //         {
  //           path: 'WxMenu',
  //           name: 'WxMenu',
  //           component: () => import('@/views/WxMenu/index'),
  //           meta: { title: '自定义菜单'}
  //         },
  //         {
  //           path: 'WxProductList',
  //           name: 'WxProductList',
  //           component: () => import('@/views/WxProductList/index'),
  //           meta: { title: '微信产品管理'}
  //         },
  //         // {
  //         //   path: 'WxNews',
  //         //   name: 'WxNews',
  //         //   component: () => import('@/views/WxNews/index'),
  //         //   meta: { title: '收到消息回复', icon: 'dashboard' ,}
  //         // },
  //         // {
  //         //   path: 'WxAntistop',
  //         //   name: 'WxAntistop',
  //         //   component: () => import('@/views/WxAntistop/index'),
  //         //   meta: { title: '关键词回复', icon: 'dashboard' ,}
  //         // },
  //         // {
  //         //   path: 'WxAttention',
  //         //   name: 'WxAttention',
  //         //   component: () => import('@/views/WxAttention/index'),
  //         //   meta: { title: '被关注回复', icon: 'dashboard' ,}
  //         // }
  //       ]
  //     },
  //   ]
  // },
  // {
  //   path: '/ticket',
  //   component: Layout,
  //   meta: { title: '票务', icon: 'clipboard' , roles:  ['ticketService'] },
  //   children: [
  //     {
  //       path: '/ticketService',
  //       name: 'ticketService',
  //       component: () => import('@/views/ticketService/index'),
  //       meta: { title: '票务', icon: 'edit' },
  //     },
  //     {
  //       path: '/orderTicket',
  //       name: 'orderTicket',
  //       component: () => import('@/views/orderTicket/index'),
  //       meta: { title: '定票订单', icon: 'skill' },
  //     },
  //     {
  //       path: '/stationList',
  //       name: 'stationList',
  //       component: () => import('@/views/stationList/index'),
  //       meta: { title: '车站列表', icon: 'edit' }
  //     },
  //     {
  //       path: '/stationPrice',
  //       name: 'stationPrice',
  //       component: () => import('@/views/stationPrice/index'),
  //       meta: { title: '车站价格列表', icon: 'edit' }
  //     },
  //   ]
  // },
  // {
  //   path: '/coupon',
  //   component: Layout,
  //   alwaysShow: true, // 日后可能会有新页面，保留侧边栏下拉
  //   meta: { title: '券码管理', icon: 'clipboard' , roles:  ['ts'] },
  //   children: [
  //     {
  //       path: '/couponCode',
  //       name: 'couponCode',
  //       component: () => import('@/views/couponCode/index'),
  //       meta: { title: '券码管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/channel',
  //   component: Layout,
  //   alwaysShow: true, // 日后可能会有新页面，保留侧边栏下拉，权限和用户管理保留一致
  //   meta: { title: '渠道管理', icon: 'international' , roles:  ['channeladm'] },
  //   children: [
  //     {
  //       path: 'channel',
  //       name: 'channel',
  //       component: () => import('@/views/channel/index'),
  //       meta: { title: '渠道管理' },
  //     }
  //   ]
  // },
  // {
  //   path: '/userRight',
  //   component: Layout,
  //   alwaysShow: true,
  //  // component: () => import('@/views/routerView/index'), // Parent router-view
  //   meta: { title: '用户管理', icon: 'user' , roles:  ['permissionadm'] },
  //   children: [
  //     {
  //       path: '/userList',
  //       name: 'userList',
  //       component: () => import('@/views/userList/index'),
  //       meta: { title: '后台用户列表', icon: '404'}
  //     },
  //     {
  //       path: '/userWxList',
  //       name: 'userWxList',
  //       component: () => import('@/views/userWxList/index'),
  //       meta: { title: '微信用户列表', icon: 'wechat'}
  //     },
  //   ]
  // },
  // {
  //   path: '/authority',
  //   component: Layout,
  //   alwaysShow: true,
  //   meta: { title: '权限管理', icon: 'lock' , roles:  ['permissionadm'] },
  //   children: [
  //     {
  //       path: '/authorityList',
  //       name: 'authorityList',
  //       component: () => import('@/views/authorityList/index'),
  //       meta: { title: '角色管理', icon: 'message'}
  //     },
  //     {
  //       path: '/Tree',
  //       name: 'Tree',
  //       component: () => import('@/views/Tree/index'),
  //       meta: { title: '树形菜单', icon: 'message'}
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath)
    }
})

export default router
