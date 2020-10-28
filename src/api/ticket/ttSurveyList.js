import request from '@/utils/request'

export function ttSurveyList(data) {
    return request({
      url: '/tt/survey/ttSurveyList',
      method: 'post',
      data: data
    })
 }

 export function ttSurveyChannel(data) {
    return request({
      url: '/tt/survey/ttSurveyChannel',
      method: 'get',
      params: data
    })
 }

 export function exportTTSurveyList(data) {
    return request({
      url: '/tt/survey/exportTTSurveyList',
      method: 'post',
      data: data
    })
 }