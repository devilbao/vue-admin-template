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

export function update(data) {
    return request({
        url: '/searchTerm/update',
        method: 'put',
        data: data
    })
}
export function deleteA(id) {
    return request({
        url: `/searchTerm/delete/${id}`,
        method: 'delete',
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