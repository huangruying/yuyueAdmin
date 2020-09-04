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