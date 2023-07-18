import { request } from "@/utils/service"
import Api from "./api"
import { Model, PageParams, PageResult } from "./types"

/** 新增/编辑 */
export function saveApi(data: Model) {
  return request({
    url: Api.save,
    method: "post",
    data
  })
}

/** 删除 */
export function deleteByIdApi(params: { modelId: string }) {
  return request({
    url: Api.deleteById,
    method: "get",
    params
  })
}

/** 详情 */
export function findByIdApi(params: { modelId: string }) {
  return request<
    ApiResponseData<{
      roleInfo: Model
      permList: any[]
    }>
  >({
    url: Api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: PageParams) {
  return request<any>({
    url: Api.findPage,
    method: "post",
    data
  })
}
