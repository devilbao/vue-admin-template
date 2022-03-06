import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/msgConfigure/list',
        method: 'get',
        params: data
    })
}
export function add(data) {
    return request({
        url: '/msgConfigure/add',
        method: 'post',
        data: data
    })
}
export function update(data) {
    return request({
        url: '/msgConfigure/update',
        method: 'put',
        data: data
    })
}

export function changeStatus(id) {
    return request({
        url: '/msgConfigure/changeStatus/' + id,
        method: 'post'
    })
}

export function deleteA(id) {
    return request({
        url: `/msgConfigure/delete/${id}`,
        method: 'delete',
    })
}

