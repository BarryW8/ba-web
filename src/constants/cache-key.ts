const SYSTEM_NAME = "v3-admin-vite"

/** 缓存数据时用到的 Key */
class CacheKey {
  static readonly TOKEN = `${SYSTEM_NAME}-token-key`
  static readonly SIDEBAR_STATUS = `${SYSTEM_NAME}-sidebar-status-key`
  static readonly ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`

  static readonly USER_ID = `${SYSTEM_NAME}$user_id`
  static readonly USER_INFO = `${SYSTEM_NAME}$user_info`
  static readonly DEVICE_ID = `${SYSTEM_NAME}$auth_device_id`
  static readonly PLATFORM = `${SYSTEM_NAME}$auth_platform`
  static readonly GAIN_BASE_URL = `${SYSTEM_NAME}$gain_base_url`
}

export default CacheKey
