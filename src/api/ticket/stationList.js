import request from '@/utils/request'

export function ttStationList(data) {
    return request({
      url: '/tt/ttStationList',
      method: 'post',
      data: data
    })
 }

 export function addTTStation(data) {
    return request({
      url: '/tt/addTTStation',
      method: 'post',
      data: data
    })
 }

 export function delTTStaion(data) {
    return request({
      url: '/tt/delTTStaion',
      method: 'post',
      data: data
    })
 }

 export function updTTStaion(data) {
    return request({
      url: '/tt/updTTStaion',
      method: 'post',
      data: data
    })
 }