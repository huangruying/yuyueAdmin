import request from '@/utils/request'

export function addOrUpdatePerm(data) {
    return request({
      url: '/wash/addOrUpdatePerm',
      method: 'post',
      data
    })
}

export function delPerm(data) {
    return request({
      url: '/wash/delPerm',
      method: 'post',
      data
    })
}
