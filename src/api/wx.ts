// src/api/wx.ts
import axios from 'axios'

// 获取企业微信配置
export const getWxConfig = (url: string) => {
    return axios.post('/api/wx/config', {
        url,
        type: 'jsapi' // 或 'agent' 等其他类型
    })
}

// 获取用户信息
export const getWxUserInfo = () => {
    return axios.get('/api/wx/userinfo')
}

// 获取外部联系人信息
export const getExternalContact = (externalUserId: string) => {
    return axios.get(`/api/wx/external-contact/${externalUserId}`)
}