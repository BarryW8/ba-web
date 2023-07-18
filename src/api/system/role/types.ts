export interface Model extends BasicModel {
  roleCode: string
  roleName: string
  roleStatus: number
}

export interface PageParams extends BasicPageParams {
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export type PageResult = ApiResponseData<BasicPageResult<Model>>
