import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { whiteList } from "@/config/white-list"
import { getToken } from "@/utils/cache/cookies"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const { menu } = to.meta
  if (menu && menu instanceof Array && menu.length > 0) {
    permissionStore.perms = menu
  } else {
    permissionStore.perms = []
  }

  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const token = getToken()

  // 判断该用户是否登录
  if (token) {
    if (to.path === "/login") {
      // 如果已经登录，并准备进入 Login 页面，则重定向到主页
      next({ path: "/" })
      NProgress.done()
    } else {
      // 检查用户信息是否存在
      if (!userStore.userInfo) {
        try {
          await userStore.getInfo()
          permissionStore.generateRoutes()

          // 设置 replace: true, 因此导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (err: any) {
          // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
          userStore.resetToken()
          ElMessage.error(err.message || "路由守卫过程发生错误")
          // next("/login")
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // 如果没有 Token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      // next("/login")
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
