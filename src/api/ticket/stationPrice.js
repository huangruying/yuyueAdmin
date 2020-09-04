import request from '@/utils/request'

export function getTTTicketPriceList(params) {
  return request({
    url: '/tt/getTTTicketPriceList',
    method: 'post',
    data: params
  })
}

export function getTTStationByIdNotIn(params) {
    return request({
      url: '/tt/getTTStationByIdNotIn',
      method: 'post',
      data: params
    })
}