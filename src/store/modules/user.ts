import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { useTagsViewStore } from "./tags-view"
import { getToken, setToken, removeToken } from "@/utils/cache/cookies"
import { getUserId, setUserId, removeUserId } from "@/utils/cache/session-storage"
import router, { resetRouter } from "@/router"
import { loginApi, getUserInfoApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import { type RouteRecordRaw } from "vue-router"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const userInfo = ref<any>(null)
  const userId = ref<string>(getUserId() || "")
  const roles = ref<string[]>([])

  const permissionStore = usePermissionStore()
  const tagsViewStore = useTagsViewStore()

  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = async ({ username, password, code }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, code })
    console.log(data.token)
    setToken(data.token)
    token.value = data.token
    setUserId(data.userId)
    userId.value = data.userId
  }
  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    userInfo.value = data
    // 保存动态路由信息
    if (data && data.menuList) {
      permissionStore.dynamicRoutes = data.menuList
      console.log("SET_ROUTES=", data.menuList)
    }
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    // const newToken = "token-" + role
    // token.value = newToken
    // setToken(newToken)
    // await getInfo()
    // permissionStore.setRoutes(roles.value)
    // resetRouter()
    // permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
    //   router.addRoute(item)
    // })
    // _resetTagsView()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    removeUserId()
    token.value = ""
    userId.value = ""
    userInfo.value = null
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    tagsViewStore.delAllVisitedViews()
    tagsViewStore.delAllCachedViews()
  }

  return { token, userInfo, userId, setRoles, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
