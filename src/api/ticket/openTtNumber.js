import request from '@/utils/request'

export function getTTStationLineTicketsList(data) {
    return request({
      url: '/tt/getTTStationLineTicketsList',
      method: 'post',
      data: data
    })
  }

  export function getTTStationLineTicketByStation(data) {
    return request({
      url: '/tt/getTTStationLineTicketByStation',
      method: 'post',
      data: data
    })
  }

  export function addOrUpdateTTStationLineTicketByStation(data) {
    return request({
      url: '/tt/addOrUpdateTTStationLineTicketByStation',
      method: 'post',
      data: data
    })
  }

  export function batchTTStationLineTicketByStation(data) {
    return request({
      url: '/tt/batchTTStationLineTicketByStation',
      method: 'post',
      data: data
    })
  }

  export function getByStation(data) {
    return request({
      url: '/tt/getByStation',
      method: 'post',
      data: data
    })
  }

  export function getBySeatLevel(data) {
    return request({
      url: '/tt/getBySeatLevel',
      method: 'post',
      data: data
    })
  }

  export function addTTStationLineTicketByStation(data) {
    return request({
      url: '/tt/addTTStationLineTicketByStation',
      method: 'post',
      data: data
    })
  }

  export function deleteByStation(data) {
    return request({
      url: '/tt/deleteByStation',
      method: 'post',
      data: data
    })
  }