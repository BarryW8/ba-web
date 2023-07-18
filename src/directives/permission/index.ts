import { type Directive } from "vue"
import { usePermissionStoreHook } from "@/store/modules/permission"

/**
 * 按钮权限指令
 * @binding.value 按钮权限编码
 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const perms = usePermissionStoreHook().perms

    const hasPermission = perms.some((btn) => {
      if (value instanceof Array) {
        console.log("permission----------", value)
        console.log("permission----------", btn)
        console.log("permission----------", typeof btn)
        console.log("permission----------", value.includes(btn))
        return value.includes(btn)
      } else return value == btn
    })

    if (!hasPermission) el.parentNode && el.parentNode.removeChild(el)
    // if (buttonPermission) if (!hasPermission) el.parentNode && el.parentNode.removeChild(el)
  }
}
