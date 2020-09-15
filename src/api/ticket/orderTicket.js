import request from '@/utils/request'

export function getTTOrderList(data) {
  return request({
    url: '/tt/getTTOrderList',
    method: 'post',
    data: data
  })
}

export function exportTTOrderList(data) {
  return request({
    url: '/tt/exportTTOrderList',
    method: 'get',
    params: data
  })
}

export function getTTOrderDetail(params) {
  return request({
    url: '/tt/getTTOrderDetail',
    method: 'post',
    data: params
  })
}

export function updateTT(params) {
  return request({
    url: '/tt/updateTT',
    method: 'post',
    data: params
  })
}