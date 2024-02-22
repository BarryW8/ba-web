import { request } from "@/utils/service"
import CommonApi from "@/api/common-api"
import { ListResult, Model, ModelResult, PageParams, PageResult } from "./types"

const BASE_API = "system-server/dictionary"
const api = {
  optionList: BASE_API + CommonApi.optionList,
  add: BASE_API + CommonApi.add,
  edit: BASE_API + CommonApi.edit,
  deleteById: BASE_API + CommonApi.deleteById,
  findById: BASE_API + CommonApi.findById,
  findPage: BASE_API + CommonApi.findPage,
  findTree: BASE_API + "/findTree"
}

/** 下拉列表 */
export function optionListApi(params?: { parentCode?: string }) {
  return request<ListResult>({
    url: api.optionList,
    method: "get",
    params
  })
}

/** 查询树 */
export function findTreeApi(data: PageParams) {
  return request<any>({
    url: api.findTree,
    method: "post",
    data
  })
}

/** 新增 */
export function addApi(data: Model) {
  return request({
    url: api.add,
    method: "post",
    data
  })
}

/** 编辑 */
export function editApi(data: Model) {
  return request({
    url: api.edit,
    method: "post",
    data
  })
}

/** 删除 */
export function deleteByIdApi(params: { modelId: string }) {
  return request({
    url: api.deleteById,
    method: "get",
    params
  })
}

/** 详情 */
export function findByIdApi(params: { modelId: string }) {
  return request<ModelResult>({
    url: api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: PageParams) {
  return request<PageResult>({
    url: api.findPage,
    method: "post",
    data
  })
}
