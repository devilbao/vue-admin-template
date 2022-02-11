import request from '@/utils/request'

export function getCode(data) {
  return request({
    url: '/user/sendMessage',
    method: 'get',
    params: data
  })
}
export function download(data) {
  return request({
    url: '/file/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: data
  })
}
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data
  })
}