import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/vue-admin-template/user/login',
        method: 'post',
        data
    })
}

export function listCompany(query) {
    return request({
        url: '/company/listCompany',
        method: 'get',
        params: query
    })
}
export function listProvince(query) {
    return request({
        url: '/company/listProvince',
        method: 'get',
        params: query
    })
}
export function getCompany(query) {
    return request({
        url: '/company/getCompany',
        method: 'get',
        params: query
    })
}