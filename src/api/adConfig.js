import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/adConfigure/list',
        method: 'get',
        params: data
    })
}

export function changeStatus(id) {
    return request({
        url: '/adConfigure/changeStatus/' + id,
        method: 'post'
    })
}
export function update(data) {
    return request({
        url: '/adConfigure/update',
        method: 'put',
        data: data
    })
}

export function deleteA(id) {
    return request({
        url: `/adConfigure/delete/${id}`,
        method: 'delete',
    })
}