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

export function addTTTicketPrice(params) {
  return request({
    url: '/tt/addTTTicketPrice',
    method: 'post',
    data: params
  })
}

export function delTTTicketByStationId(params) {
  return request({
    url: '/tt/delTTTicketByStationId',
    method: 'post',
    data: params
  })
}

export function getTTicketPriceById(params) {
  return request({
    url: '/tt/getTTTicketPriceById',
    method: 'post',
    data: params
  })
}

export function updTTTicketByStationId(params) {
  return request({
    url: '/tt/updTTTicketByStationId',
    method: 'post',
    data: params
  })
}