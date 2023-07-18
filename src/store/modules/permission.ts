import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes, asyncRoutes } from "@/router"
import asyncRouteSettings from "@/config/async-route"
import Layout from "@/layout/index.vue"

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("@/views/**/*.vue")

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const perms = ref<any[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  // 构建路由
  const generateRoutes = () => {
    let accessRoutes
    if (asyncRouteSettings.open) {
      // 后台权限路由
      accessRoutes = filterAsyncRoutes(dynamicRoutes.value)
      console.log("加载路由 accessRoutes=", accessRoutes)
    } else {
      // 开放所有本地注册路由
      accessRoutes = asyncRoutes
    }
    routes.value = [...constantRoutes, ...accessRoutes]
    console.log(routes.value)
    dynamicRoutes.value = accessRoutes
    return accessRoutes
  }

  return { routes, perms, dynamicRoutes, generateRoutes }
})

export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

// 遍历后台返回的菜单，生成动态路由
const filterAsyncRoutes = (routes: any[]) => {
  const res: any[] = []
  routes.forEach((item) => {
    // 重新封装路由字段
    const route: any = {
      path: item.routePath,
      name: item.menuName,
      meta: {
        title: item.menuName,
        icon: item.icon,
        // item.isCache  是否缓存 0不缓存，1缓存
        noCache: item.isCache !== "1" // true 不会被 <keep-alive> 缓存；false 则会被缓存
      },
      hidden: !!item.isHide
    }

    if (item.pagePath) {
      // Layout ParentView 组件特殊处理
      if (item.pagePath === "Layout") {
        route.component = Layout
      } else {
        console.log("pagePath--------------", `@/views/${item.pagePath}`)
        console.log("pagePath--------------", modules)
        route.component = modules[`@/views/${item.pagePath}.vue`]
        // route.component = loadView(route.component)
        // 收集页面按钮权限
        if (item.perms) {
          route.meta.menu = item.perms.split(",")
        }
      }
      // else if (route.component === 'ParentView') {
      //   item.component = ParentView
      // } else if (route.component === 'InnerLink') {
      //   item.component = InnerLink
      // } else {
      //   item.component = loadView(route.component)
      // }
    }
    console.log(item.children)
    if (item.children && item.children instanceof Array && item.children.length) {
      route.children = filterAsyncRoutes(item.children)
    }
    res.push(route)
  })
  return res
}

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
