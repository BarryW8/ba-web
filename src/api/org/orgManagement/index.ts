import { request } from "@/utils/service"
import CommonApi from "@/api/common-api"

const BASE_API = `system-server/orgManagement`
const api = {
  add: BASE_API + CommonApi.add,
  edit: BASE_API + CommonApi.edit,
  deleteById: BASE_API + CommonApi.deleteById,
  findById: BASE_API + CommonApi.findById,
  findPage: BASE_API + CommonApi.findPage,
  findTree: BASE_API + "/findTree"
}

/** 查询树 */
export function findTreeApi(data: any) {
  return request<any>({
    url: api.findTree,
    method: "post",
    data
  })
}

/** 新增 */
export function addApi(data: any) {
  return request<any>({
    url: api.add,
    method: "post",
    data
  })
}

/** 编辑 */
export function editApi(data: any) {
  return request<any>({
    url: api.edit,
    method: "post",
    data
  })
}

/** 删除 */
export function deleteByIdApi(params: { modelId: string }) {
  return request<any>({
    url: api.deleteById,
    method: "get",
    params
  })
}

/** 详情 */
export function findByIdApi(params: { modelId: string }) {
  return request<any>({
    url: api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: any) {
  return request<any>({
    url: api.findPage,
    method: "post",
    data
  })
}
