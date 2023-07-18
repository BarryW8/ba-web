import { request } from "@/utils/service"
import Api from "./api"
import { ListResult, Model, ModelResult, PageParams, PageResult } from "./types"

/** 下拉列表 */
export function optionListApi(params?: { modelId?: string }) {
  return request<ListResult>({
    url: Api.optionList,
    method: "get",
    params
  })
}

/** 查询树-封装按钮权限 */
export function findTreePermsApi() {
  return request<ListResult>({
    url: Api.findTreePerms,
    method: "get"
  })
}

/** 查询树 */
export function findTreeApi(data: PageParams) {
  return request<any>({
    url: Api.findTree,
    method: "post",
    data
  })
}

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
  return request<ModelResult>({
    url: Api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: PageParams) {
  return request<PageResult>({
    url: Api.findPage,
    method: "post",
    data
  })
}
