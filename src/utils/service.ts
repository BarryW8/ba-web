import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"
import { getUserId, getDeviceId, getPlatform } from "./cache/session-storage"

/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      console.log("----------interceptors", response)
      const { code, msg } = response.data
      // 如果是二进制数据，则直接返回
      const responseType = response.request?.responseType
      if (responseType === "blob" || responseType === "arraybuffer") {
        return response.data
      }
      // 如果没有 code, 代表这不是项目后端开发的 api
      if (code === undefined) {
        ElMessage.error("非本系统的接口")
        return Promise.reject(new Error("非本系统的接口"))
      }
      // 如果请求成功，直接放行
      const successCode = [0, 200, 20000]
      if (successCode.includes(code)) {
        return response.data
      }
      // 如果状态码需要退出登录，如 Token 过期
      const exitCode = [250004, 250005, 250007, 250008, 250009, 250010]
      if (exitCode.includes(code)) {
        // 退出登录并强制刷新页面（会重定向到登录页）
        useUserStoreHook().logout()
        setTimeout(() => {
          location.reload()
        }, 800)
      }
      // 否则请求失败，提示
      ElMessage.error({
        message: msg,
        type: "error",
        duration: 2 * 1000
      })
      return Promise.reject(response.data)
    },
    (error) => {
      // 处理 HTTP 状态码
      const status = get(error, "response.status")
      error.message = httpError(status)
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

const httpError = (code: number): String => {
  switch (code) {
    case 400:
      return "请求错误"
    case 401:
      return "登录过期"
    case 403:
      return "拒绝访问"
    case 404:
      return "请求地址出错"
    case 408:
      return "请求超时"
    case 500:
      return "服务器内部错误"
    case 501:
      return "服务未实现"
    case 502:
      return "网关错误"
    case 503:
      return "服务不可用"
    case 504:
      return "网关超时"
    case 505:
      return "HTTP 版本不受支持"
  }
  return ""
}

/** 创建请求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        // 携带 Token
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
        token: token,
        userId: getUserId(),
        "x-http-device": getDeviceId(),
        "x-http-app": "1",
        "x-http-os": getPlatform()
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** 用于网络请求的实例 */
const service = createService()
/** 用于网络请求的方法 */
export const request = createRequest(service)
