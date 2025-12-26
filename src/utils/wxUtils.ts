// src/utils/wxUtils.ts
import wx from 'weixin-js-sdk'

export class WxUtils {
    // 获取当前外部联系人
    static getCurExternalContact(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.invoke('getCurExternalContact', {}, (res: any) => {
                if (res.err_msg === 'getCurExternalContact:ok') {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    }

    // 获取用户信息
    static getUserId(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.invoke('getUserId', {}, (res: any) => {
                if (res.err_msg === 'getUserId:ok') {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    }

    // 打开聊天窗口
    static openEnterpriseChat(userIds: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.invoke('openEnterpriseChat', {
                userIds: userIds.join('|'),
                groupName: '客户群聊'
            }, (res: any) => {
                if (res.err_msg === 'openEnterpriseChat:ok') {
                    resolve(res)
                } else {
                    reject(res)
                }
            })
        })
    }

    // 隐藏菜单项
    static hideMenuItems(menuItems: string[]) {
        wx.hideMenuItems({
            menuList: menuItems
        })
    }

    // 显示菜单项
    static showMenuItems(menuItems: string[]) {
        wx.showMenuItems({
            menuList: menuItems
        })
    }
}