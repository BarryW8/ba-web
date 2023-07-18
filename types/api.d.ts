/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: number
  data: T
  msg: string
}

/** 分页请求参数 */
interface BasicModel {
  id?: string
  orderBy?: number
  note?: string
  createBy?: string
  createTime?: Date
  updateBy?: string
  updateTime?: Date
}

/** 分页请求参数 */
interface BasicPageParams {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
}

/** 分页响应数据 */
interface BasicPageResult<T> {
  data: T[]
  total: number
}
