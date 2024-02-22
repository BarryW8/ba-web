import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import router, { constantRoutes, asyncRoutes } from "@/router"
import asyncRouteSettings from "@/config/async-route"

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("/src/views/**/*.vue")
const Layout = () => import("@/layout/index.vue")

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const perms = ref<any[]>([])
  const dynamicRoutes = ref<any>()

  // 构建路由
  const generateRoutes = () => {
    let accessRoutes
    if (asyncRouteSettings.open) {
      // 后台权限路由
      accessRoutes = filterAsyncRoutes(dynamicRoutes.value)
    } else {
      // 开放所有本地注册路由
      accessRoutes = asyncRoutes
    }
    console.log("加载路由 accessRoutes=", accessRoutes)

    routes.value = [...constantRoutes, ...accessRoutes]
    dynamicRoutes.value = accessRoutes

    // dynamically add accessible routes
    router.options.routes = [...constantRoutes, ...accessRoutes]
    accessRoutes.forEach((item) => router.addRoute(item))
  }

  return { routes, perms, dynamicRoutes, generateRoutes }
})

export const loadView = (view: string) => {
  let res
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0]
    if (dir === view) {
      console.log(modules[path]())
      res = () => modules[path]()
    }
  }
  return res
}

// 遍历后台返回的菜单，生成动态路由
// const filterAsyncRoutes = (routes: any[]) => {
//   const res: any[] = []
//   routes.forEach((item) => {
//     // 重新封装路由字段
//     const route: any = {
//       path: item.routePath,
//       name: item.menuName,
//       meta: {
//         title: item.menuName,
//         icon: item.icon,
//         hidden: !!item.isHide,
//         // item.isCache  是否缓存 0不缓存，1缓存
//         noCache: item.isCache !== "1" // true 不会被 <keep-alive> 缓存；false 则会被缓存
//       }
//     }

//     if (item.pagePath) {
//       // Layout ParentView 组件特殊处理
//       if (item.pagePath === "Layout") {
//         route.component = Layout
//       } else {
//         console.log("pagePath--------------", modules[`/src/views/${item.pagePath}.vue`])
//         route.component = () => modules[`/src/views/${item.pagePath}.vue`]()
//         // console.log("pagePath--------------", loadView(item.pagePath))
//         // route.component = loadView(route.pagePath)
//         // 收集页面按钮权限
//         if (item.perms) {
//           route.meta.menu = item.perms.split(",")
//         }
//       }
//       // else if (route.component === 'ParentView') {
//       //   item.component = ParentView
//       // } else if (route.component === 'InnerLink') {
//       //   item.component = InnerLink
//       // } else {
//       //   item.component = loadView(route.component)
//       // }
//     }
//     if (item.children && item.children instanceof Array && item.children.length) {
//       route.children = filterAsyncRoutes(item.children)
//     }
//     res.push(route)
//   })
//   return res
// }

// 遍历后台返回的菜单，生成动态路由
const filterAsyncRoutes = (routes: any) => {
  const res: any[] = []
  let {levelOneList, levelTwoList} = routes;
  levelOneList.forEach(menu1 => {
    // 重新封装路由字段
    const route1: any = {
      path: menu1.routePath,
      name: menu1.menuName,
      meta: {
        title: menu1.menuName,
        svgIcon: menu1.icon,
        hidden: !!menu1.isHide,
        // item.isCache  是否缓存 0不缓存，1缓存
        noCache: menu1.isCache !== "1" // true 不会被 <keep-alive> 缓存；false 则会被缓存
      },
      children: []
    }

    // 目录
    route1.component = Layout

    // 菜单
    levelTwoList.forEach(menu2 => {
      console.log(menu2.parentId)
      console.log(menu1.id)
      if (menu2.parentId !== menu1.id) return
      // 重新封装路由字段
      const route2: any = {
        path: menu2.routePath,
        name: menu2.menuName,
        meta: {
          title: menu2.menuName,
          svgIcon: menu2.icon,
          hidden: !!menu2.isHide,
          // 按钮权限
          menu: menu2.perms ? menu2.perms.split(",") : '',
          // isCache  是否缓存 0不缓存，1缓存
          noCache: menu2.isCache !== "1" // true 不会被 <keep-alive> 缓存；false 则会被缓存,
        },
        component: () => modules[`/src/views/${menu2.pagePath}.vue`]()
      }
      route1.children.push(route2)
    })
    console.log(route1)

    // if (menu1.menuType) {
    //   console.log(menu1.menuType)
    //   // Layout ParentView 组件特殊处理
    //   if (menu1.menuType === "M") {
    //   } else {

    //   }
    //   // else if (route.component === 'ParentView') {
    //   //   item.component = ParentView
    //   // } else if (route.component === 'InnerLink') {
    //   //   item.component = InnerLink
    //   // } else {
    //   //   item.component = loadView(route.component)
    //   // }
    // }
    res.push(route1)
  })
  return res
}

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
