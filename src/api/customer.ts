import http from './http'

enum CustomerApi {
    CustomerList = '/api/customer/list',
    CustomerDetail = '/api/customer/detail',
    CustomerCreate = '/api/customer/create',
    CustomerUpdate = '/api/customer/update',
    CustomerDelete = '/api/customer/delete',
}

//获取客户列表
export const getCustomerList = (params: any) => {
    return http.get(CustomerApi.CustomerList, { params })
}
//获取客户详情
export const getCustomerDetail = (id: string) => {
    return http.get(`${CustomerApi.CustomerDetail}/${id}`)
}
//创建客户
export const createCustomer = (data: any) => {
    return http.post(CustomerApi.CustomerCreate, data)
}
//更新客户
export const updateCustomer = (id: string, data: any) => {
    return http.put(`${CustomerApi.CustomerUpdate}/${id}`, data)
}
//删除客户
export const deleteCustomer = (id: string) => {
    return http.delete(`${CustomerApi.CustomerDelete}/${id}`)
}
