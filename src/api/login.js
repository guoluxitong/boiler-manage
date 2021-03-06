import request from '@/utils/request'
import qs from 'qs'

export function login(account, password) {
  return request({
    url: '/account/customer/login',
    method: 'post',
    data: qs.stringify({ loginId: account, password: password})
  })
}
export function changeOrgName( id, customerName, status) {
  return request({
    url: '/webapi/datacenter/core/customer/modify',
    method: 'post',
    data: qs.stringify({ id: id, customerName: customerName, status: status})
  })
}

export function wechatlogin1(account) {
  return request({
    url: '/wechat/employee/find',
    method: 'get',
    params: { 'loginId': account}
  })
}
export function wechatlogin(openId) {
  return request({
    url: '/account/wechat/customer/login',
    method: 'post',
    data: qs.stringify(openId)
  })
}
export function getUserInfo(employeeId) {
  return request({
    url: '/webapi/boilermanage/user/info',
    method: 'get',
    params:{ "employeeId": employeeId}
  })
}
export function loginout(query) {
  return request({
    url: '/webapi/boilermanage/logout/out',
    method: 'get',
    params: query
  })
}
