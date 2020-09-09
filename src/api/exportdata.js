import request from '@/utils/request'
import qs from 'qs'

export function exportData(data) {
  return request({
    url: '/webapi/report/device/excel',
    method: 'get',
    params: { 'deviceNo': data.deviceNo,'begintime': data.begintime,'endtime': data.endtime,'newframe': data.newframe,}
  })
}




