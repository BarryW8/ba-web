import { EnumValue } from "@/utils/enum-value"

// tagTypeSuccess()主要用于表格展示时使用特定类型的tag展示，可见PageTable组件
export const AppTypeEnum = {
  WEB: EnumValue.of(1, "WEB").tagTypeSuccess(),
  THINKING: EnumValue.of(2, "Thinking App").tagTypePrimary(),
  APPLET: EnumValue.of(3, "小程序").tagTypeWarning()
}
