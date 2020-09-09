import request from '@/utils/request'
import qs from 'qs'
export function queryWeChatAmount(query) {
  return request({
    url: '/screen/wechat/users/amount',
    method: 'get',
    params: query
  })
}
export function queryWeChatUser(query) {
  return request({
    url: '/screen/wechat/devices',
    method: 'get',
    params: query
  })
}
