import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/searchTerm/add',
    method: 'post',
    data: data
  })
}

export function changeStatus(id) {
  return request({
    url: '/searchTerm/changeStatus/' + id,
    method: 'post'
  })
}

export function list(query) {
  return request({
    url: '/searchTerm/list',
    method: 'get',
    params: query
  })
}

export function remove(id) {
  return request({
    url: '/searchTerm/remove/' + id,
    method: 'delete'
  })
}