export interface Model extends BasicModel {
  parentId?: string
  menuName: string
  menuType: string
  menuCode?: string
  icon?: string
  isFrame: number
  routePath: string
  pagePath: string
  perms?: string
  query?: string
  isCache: number
  visible: number
  status: number
}

export interface PageParams {
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export type PageResult = ApiResponseData<BasicPageResult<Model>>

export type ListResult = ApiResponseData<Array<Model>>

export type ModelResult = ApiResponseData<Model>
