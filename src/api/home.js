import request from '@/utils/request'

export function getCode(data) {
  return request({
    url: '/user/sendMessage',
    method: 'get',
    params: data
  })
}