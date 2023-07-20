// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"
// util
import common from "@/utils/common"
// component
// 分页组件
import Pagination from "@/components/Pagination/index.vue"
// 文件上传组件
import FileUpload from "@/components/FileUpload/index.vue"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload/index.vue"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview/index.vue"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

/** 全局指令 */
app.config.globalProperties.$common = common
// 全局组件挂载
app.component("Pagination", Pagination)
app.component("FileUpload", FileUpload)
app.component("ImageUpload", ImageUpload)
app.component("ImagePreview", ImagePreview)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
