// src/utils/wxEnv.ts
export const isWxWork = () => {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('wxwork')
}

export const getWxUserAgentInfo = () => {
    const ua = navigator.userAgent
    const isWxWork = ua.toLowerCase().includes('wxwork')
    const versionMatch = ua.match(/wxwork\/([\d.]+)/i)
    const corpIdMatch = ua.match(/corpid\/([^;]+)/i)

    return {
        isWxWork,
        version: versionMatch ? versionMatch[1] : null,
        corpId: corpIdMatch ? decodeURIComponent(corpIdMatch[1]) : null
    }
}