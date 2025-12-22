import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse
} from 'axios'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
    timeout: 60 * 1000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => { // 使用新类型
        // 添加认证 token
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
http.interceptors.response.use(
    (response: AxiosResponse) => {
        // 统一处理响应数据
        return response.data
    },
    (error) => {
        // 统一错误处理
        if (error.response?.status === 401) {
            // 清除本地 token
            localStorage.removeItem('access_token')
        }
        return Promise.reject(error)
    }
)

export default http