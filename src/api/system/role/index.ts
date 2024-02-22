import { request } from "@/utils/service"
import CommonApi from "@/api/common-api"
import { Model, PageParams, PageResult } from "./types"

const BASE_API = "system-server/sysRole"
const api = {
  add: BASE_API + CommonApi.add,
  edit: BASE_API + CommonApi.edit,
  deleteById: BASE_API + CommonApi.deleteById,
  findById: BASE_API + CommonApi.findById,
  findPage: BASE_API + CommonApi.findPage,
  findUserRole: BASE_API + "/findUserRole",
  saveUserRole: BASE_API + "/saveUserRole"
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
  return request<
    ApiResponseData<{
      roleInfo: Model
      permList: any[]
    }>
  >({
    url: api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: PageParams) {
  return request<any>({
    url: api.findPage,
    method: "post",
    data
  })
}
