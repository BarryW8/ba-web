export interface Model extends BasicModel {
  code: string
  name: string
  parentId?: string
  parentCode?: string
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
