import request from '@/utils/request'

export function listCoupon(data) {
  return request({
    url: '/wash/coupon/listCoupon',
    method: 'post',
    data
  })
}

export function listCouponBatch(data) {
    return request({
    url: '/wash/coupon/listCouponBatch',
    method: 'post',
    data
  })
}

export function getCouponById(data) {
    return request({
    url: '/wash/coupon/getCouponById',
    method: 'post',
    data
  })
}

export function addCoupon(data) {
    return request({
    url: '/wash/coupon/addCoupon',
    method: 'post',
    data
  })
}

export function updateCoupon(data) {
    return request({
    url: '/wash/coupon/updateCoupon',
    method: 'post',
    data
  })
}

export function deleteCouponById(data) {
    return request({
    url: '/wash/coupon/deleteCouponById',
    method: 'post',
    data
  })
}

export function recoveryCouponById(data) {
    return request({
    url: '/wash/coupon/recoveryCouponById',
    method: 'post',
    data
  })
}

export function generateCouponCode(data) {
    return request({
    url: '/wash/coupon/generateCouponCode',
    method: 'post',
    data
  })
}

export function listCouponCode(data) {
    return request({
    url: '/wash/coupon/listCouponCode',
    method: 'post',
    data
  })
}

export function exportCouponCode(data) {
    return request({
    url: '/wash/coupon/exportCouponCode',
    method: 'post',
    data
  })
}

export function deleteCouponCode(data) {
    return request({
    url: '/wash/coupon/deleteCouponCode',
    method: 'post',
    data
  })
}

export function recoveryCouponCode(data) {
    return request({
    url: '/wash/coupon/recoveryCouponCode',
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

export function bindCouponCodeToMobile(data) {
  return request({
    url: '/wash/coupon/bindCouponCodeToMobile',
    method: 'post',
    data
  })
}