import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/wash/washAdminLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/wash/washAdminLoginOut',
    method: 'post',
    data
  })
}

export function loginCopy(data) {
  return request({
    url: '/wash/login',
    method: 'post',
    data
  })
}

export function tt(data) { //测试权限动态添加路由
  return request({
    url: '/tt',
    method: 'post',
    data
  })
}

export function userupdatePwd(data) {
  return request({
    url: '/wash/user/updatePwd',
    method: 'post',
    data
  })
}