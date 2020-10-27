import request from '@/utils/request'

export function getTTStation(data) {
  return request({
    url: '/tt/getTTStation',
    method: 'get',
    params: data
  })
}

export function preAddTTPassenger(data) {
   return request({
     url: '/tt/preAddTTPassenger',
     method: 'post',
     data: data
   })
}

export function addTTPassenger(data) {
    return request({
      url: '/tt/addTTPassenger',
      method: 'post',
      data: data
    })
 }

 export function getAvailableTime(data) {
    return request({
      url: '/common/getAvailableTime',
      method: 'get',
      params: data
    })
 }

 export function getTTStationByNotInId(data) {
  return request({
    url: '/tt/getTTStationByNotInId',
    method: 'post',
    data: data
  })
}

export function getSeatLeavelPriceByIdAndEid(data) {
  return request({
    url: '/tt/getSeatLeavelPriceByIdAndEid',
    method: 'post',
    data: data
  })
}

export function getFromOrToStation(data) {
  return request({
    url: '/tt/getFromOrToStation',
    method: 'post',
    data: data
  })
}

export function getFromStationList(data) {
  return request({
    url: '/tt/getFromStationList',
    method: 'post',
    data: data
  })
}

export function getToStationList(data) {
  return request({
    url: '/tt/getToStationList',
    method: 'post',
    data: data
  })
}

export function getSeatLevelByStation(data) {
  return request({
    url: '/tt/getSeatLevelByStation',
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