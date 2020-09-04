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