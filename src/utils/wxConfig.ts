// src/utils/wxConfig.ts
import wx from 'weixin-js-sdk'
import { getWxConfig } from '@/api/wx' // 假设你有后端接口获取配置

interface WxConfig {
    appId: string
    timestamp: number
    nonceStr: string
    signature: string
    jsApiList: string[]
    openTagList?: string[]
}

export const initWxConfig = async (url: string) => {
    try {
        // 从后端获取签名等配置信息
        const configData: WxConfig = await getWxConfig(url)

        // 配置微信JS-SDK
        wx.config({
            beta: true, // 开启内测接口
            debug: false, // 开发时可设为true
            appId: configData.appId,
            timestamp: configData.timestamp,
            nonceStr: configData.nonceStr,
            signature: configData.signature,
            jsApiList: [
                'getCurExternalContact',
                'getUserId',
                'getContext',
                'agentConfig',
                'openEnterpriseChat',
                'selectEnterpriseContact',
                'sendChatMessage',
                'getLocalImgData',
                'previewFile',
                'openDefaultBrowser',
                'openLocation',
                'getLocation',
                'translateVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'startRecord',
                'stopRecord',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'getNetworkType',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'closeWindow',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem'
            ],
            openTagList: [
                'wx-open-launch-weapp',
                'wx-open-launch-app'
            ]
        })

        // 配置成功回调
        wx.ready(() => {
            console.log('企业微信JS-SDK配置成功')
        })

        // 配置失败回调
        wx.error((res) => {
            console.error('企业微信JS-SDK配置失败:', res)
        })
    } catch (error) {
        console.error('获取微信配置失败:', error)
    }
}