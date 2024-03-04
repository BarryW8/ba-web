import { ElMessage, ElMessageBox, ElNotification, ElLoading } from "element-plus"

const common = {
  // 获取操作系统信息
  getOsInfo() {
    const userAgent = navigator.userAgent.toLowerCase()
    let name = "Unknown"
    let version = "Unknown"
    if (userAgent.indexOf("win") > -1) {
      name = "Windows"
      if (userAgent.indexOf("windows nt 5.0") > -1) {
        version = "Windows 2000"
      } else if (userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("windows nt 5.2") > -1) {
        version = "Windows XP"
      } else if (userAgent.indexOf("windows nt 6.0") > -1) {
        version = "Windows Vista"
      } else if (userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
        version = "Windows 7"
      } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
        version = "Windows 8"
      } else if (userAgent.indexOf("windows nt 6.3") > -1) {
        version = "Windows 8.1"
      } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows nt 10.0") > -1) {
        version = "Windows 10"
      } else {
        version = "Unknown"
      }
    } else if (userAgent.indexOf("iphone") > -1) {
      name = "Iphone"
    } else if (userAgent.indexOf("mac") > -1) {
      name = "Mac"
    } else if (
      userAgent.indexOf("x11") > -1 ||
      userAgent.indexOf("unix") > -1 ||
      userAgent.indexOf("sunname") > -1 ||
      userAgent.indexOf("bsd") > -1
    ) {
      name = "Unix"
    } else if (userAgent.indexOf("linux") > -1) {
      if (userAgent.indexOf("android") > -1) {
        name = "Android"
      } else {
        name = "Linux"
      }
    } else {
      name = "Unknown"
    }
    return { name, version }
  },
  // 生成uuid
  getUuid() {
    const temp_url = URL.createObjectURL(new Blob())
    const uuid = temp_url.toString() // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
    URL.revokeObjectURL(temp_url)
    return uuid.substr(uuid.lastIndexOf("/") + 1)
  },
  // 判断是否选中单条记录
  checkSingle(isSingle: boolean): boolean {
    if (isSingle) {
      ElMessage({
        showClose: true,
        message: "请选择单行进行操作",
        type: "warning"
      })
    }
    return isSingle
  },
  // 判断是否选中记录
  checkSelect(isSelect: boolean): boolean {
    if (isSelect) {
      ElMessage({
        showClose: true,
        message: "请选择需要操作的记录",
        type: "warning"
      })
    }
    return isSelect
  },
  menu2Tree(menus: any): any[] {
    const res: any[] = []
    let { levelOneList, levelTwoList } = menus
    console.log("levelOneList---", levelOneList)
    console.log("levelTwoList---", levelTwoList)

    levelOneList.forEach((menu1) => {
      // 目录
      menu1.children = []

      // 菜单
      levelTwoList.forEach((menu2) => {
        if (menu2.parentId === menu1.id) {
          menu1.children.push(menu2)
          return
        }
        // 将没有父节点的菜单展示出来，方便修改
        let index = levelOneList.findIndex((item) => menu2.parentId === item.id)
        if (index === -1) {
          res.push(menu2)
        }
      })

      res.push(menu1)
    })
    return res
  }
}

export default common
