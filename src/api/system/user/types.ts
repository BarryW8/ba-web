export interface Model extends BasicModel {
  username: string
  avatar?: string
  nickName?: string
  realName?: string
  telephone: string
  email?: string
  birthday?: Date
  sex: number | string
}

export interface PageParams extends BasicPageParams {
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export type PageResult = ApiResponseData<BasicPageResult<Model>>
