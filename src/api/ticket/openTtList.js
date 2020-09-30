import request from '@/utils/request'

export function getTTStationLineList(data) {
  return request({
    url: '/tt/getTTStationLineList',
    method: 'post',
    data: data
  })
}

export function deleteTTStationLine(data) {
    return request({
      url: '/tt/deleteTTStationLine',
      method: 'post',
      data: data
    })
}

export function getTTStationTemp(params) {
    return request({
      url: '/tt/getTTStationTemp',
      method: 'post',
      data: params
    })
}

export function getStationToPrice(params) {
    return request({
      url: '/tt/getStationToPrice',
      method: 'post',
      data: params
    })
}

export function addStationLine(params) {
    return request({
      url: '/tt/addStationLine',
      method: 'post',
      data: params
    })
}