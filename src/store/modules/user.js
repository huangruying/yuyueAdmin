import { login, logout, getInfo , tt , loginCopy } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui';
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: []
}

const mutations = {
  RESET_STATE: (state) => {
    state.data = {}
    state.name = ''
    state.avatar = ''
    // state.roles = []
    removeToken()
    localStorage.removeItem('data')
    // Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  MENUS: (state, menus) => {
    state.menus = menus
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        if(!data.roles){
          Message({
            message: '检测到你无权限访问该系统，请联系客服！',
            type: 'warning'
          });
          return false
        }
        commit('SET_TOKEN', data.Authorization)
        setToken(data.Authorization)
        var dataList = JSON.stringify(data)
        localStorage.setItem('data',dataList)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 测试动态添加路由数据
      // tt().then(res=>{
      //     commit('MENUS', res)
      // 下面有收括号



      var obj = localStorage.getItem('data')
      var obj = JSON.parse(obj)
      // console.log(obj);
      var data = {
        roles: obj.roles,
        name: obj.username,
        avatar: obj.pic
      }
      const { roles, name, avatar , Authorization } = data
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      resolve(data)
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })

      // })  // 记得删除
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      var obj = localStorage.getItem('data')
      var obj = JSON.parse(obj)
      removeToken() 
      resetRouter()
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('RESET_STATE')
      resolve({code: '200'})
      // logout({
      //   username: obj.username
      // }).then((res) => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   commit('RESET_STATE')
      //   resolve(res)
      // }).catch(error => {
      //   reject(error)
      // })


      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()

      //   // reset visited views and cached views
      //   // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //   dispatch('tagsView/delAllViews', null, { root: true })

      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
