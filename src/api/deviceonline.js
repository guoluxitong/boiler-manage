import request from '@/utils/request1'

export function queryDeviceByOnline(query) {
  return request({
    url: '/online',
    method: 'get',
    params: query
  })
}

