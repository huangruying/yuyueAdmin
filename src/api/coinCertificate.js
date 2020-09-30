import request from '@/utils/request'

export function listRedeem(data) {
  return request({
    url: '/wash/redeem/listRedeem',
    method: 'post',
    data
  })
}

export function productList4Select(data) {
    return request({
      url: '/wash/product/productList4Select',
      method: 'post',
      data
    })
}

export function findIproductInfos(data) {
    return request({
      url: '/wash/product/findIproductInfos',
      method: 'post',
      data
    })
}

export function addRedeem(data) {
  return request({
    url: '/wash/redeem/addRedeem',
    method: 'post',
    data
  })
}

export function updateRedeem(data) {
  return request({
    url: '/wash/redeem/updateRedeem',
    method: 'post',
    data
  })
}

export function deleteRedeemById(data) {
  return request({
    url: '/wash/redeem/deleteRedeemById',
    method: 'post',
    data
  })
}

export function recoveryRedeemById(data) {
  return request({
    url: '/wash/redeem/recoveryRedeemById',
    method: 'post',
    data
  })
}

export function findWashChannel(data) {
  return request({
    url: '/wash/washChannel/findWashChannel',
    method: 'post',
    data
  })
}

export function listRedeemCode(data) {
  return request({
    url: '/wash/redeem/listRedeemCode',
    method: 'post',
    data
  })
}

export function recoveryRedeemCode(data) {
  return request({
    url: '/wash/redeem/recoveryRedeemCode',
    method: 'post',
    data
  })
}

export function deleteRedeemCode(data) {
  return request({
    url: '/wash/redeem/deleteRedeemCode',
    method: 'post',
    data
  })
}

export function bindRedeemCodeToMobile(data) {
  return request({
    url: '/wash/redeem/bindRedeemCodeToMobile',
    method: 'post',
    data
  })
}

export function list4Select(data) {
  return request({
    url: '/wash/channe/list4Select',
    method: 'post',
    data
  })
}

export function generateRedeemCode(data) {
  return request({
    url: '/wash/redeem/generateRedeemCode',
    method: 'post',
    data
  })
}