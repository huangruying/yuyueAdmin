import request from '@/utils/request'

export function getTTOrderList(data) {
  return request({
    url: '/tt/getTTOrderList',
    method: 'post',
    data: data
  })
}

// export function exportTTOrderList(data) {
//   return request({
//     url: '/tt/exportTTOrderList',
//     method: 'get',
//     params: data
//   })
// }

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

export function refund(params) {
  return request({
    url: '/tt/refund',
    method: 'post',
    data: params
  })
}

export function exportTTOrderList(params) {
  return request({
    url: '/tt/exportTTOrderList',
    responseType: 'blob', // 表明返回服务器返回的数据类型
    method: 'post',
    data: params
  })
}

export function importTTOrderList(params) {
  return request({
    url: '/tt/importTTOrderList',
    method: 'post',
    data: params
  })
}

export function getFromStationList(data) {
  return request({
    url: '/tt/getFromStationList',
    method: 'post',
    data: data
  })
}

export function getToStationNewList(data) {
  return request({
    url: '/tt/getToStationNewList',
    method: 'post',
    data: data
  })
}

export function selectTicketDate(data) {
  return request({
    url: '/tt/selectTicketDate',
    method: 'post',
    data: data
  })
}