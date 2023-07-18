import CacheKey from "@/constants/cache-key"

// token
export const getToken = () => {
  return sessionStorage.getItem(CacheKey.TOKEN)
}
export const setToken = (token: string) => {
  return sessionStorage.setItem(CacheKey.TOKEN, token)
}
export const removeToken = () => {
  return sessionStorage.removeItem(CacheKey.TOKEN)
}

// userId
export const getUserId = () => {
  return sessionStorage.getItem(CacheKey.USER_ID)
}
export const setUserId = (userId: string) => {
  return sessionStorage.setItem(CacheKey.USER_ID, userId)
}
export const removeUserId = () => {
  return sessionStorage.removeItem(CacheKey.USER_ID)
}

// userInfo
export const getUserInfo = () => {
  return sessionStorage.getItem(CacheKey.USER_INFO)
}
export const setUserInfo = (userInfo: any) => {
  return sessionStorage.setItem(CacheKey.USER_INFO, userInfo)
}
export const removeUserInfo = () => {
  return sessionStorage.removeItem(CacheKey.USER_INFO)
}

// x-http-device
export const getDeviceId = () => {
  return sessionStorage.getItem(CacheKey.DEVICE_ID)
}
export const setDeviceId = (deviceId: string) => {
  return sessionStorage.setItem(CacheKey.DEVICE_ID, deviceId)
}
export const removeDeviceId = () => {
  return sessionStorage.removeItem(CacheKey.DEVICE_ID)
}

// x-http-os
export const getPlatform = () => {
  return sessionStorage.getItem(CacheKey.PLATFORM)
}
export const setPlatform = (platform: string) => {
  return sessionStorage.setItem(CacheKey.PLATFORM, platform)
}
export const removePlatform = () => {
  return sessionStorage.removeItem(CacheKey.PLATFORM)
}

// 图片上传地址
export const setGainBaseUrl = (url: string) => {
  return sessionStorage.setItem(CacheKey.GAIN_BASE_URL, url)
}
export const getGainBaseUrl = () => {
  return sessionStorage.getItem(CacheKey.GAIN_BASE_URL)
}
export const removeGainBaseUrl = () => {
  return sessionStorage.removeItem(CacheKey.GAIN_BASE_URL)
}
