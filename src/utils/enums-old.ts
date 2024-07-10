// 定义枚举
enum AppTypeEnum {
  WEB,
  THINKING,
  APPLET
}

// 定义接口
export interface AppType {
  [AppTypeEnum.WEB]: {
    code: "1"
    name: "WEB"
    color: "success"
  }
  [AppTypeEnum.THINKING]: {
    code: "2"
    name: "Thinking App"
    color: "primary"
  }
  [AppTypeEnum.APPLET]: {
    code: "3"
    name: "小程序"
    color: "warning"
  }
}

// 组件props接口定义
// interface ComponentPropsType {
//   type: AppType[AppTypeEnum]
// }
