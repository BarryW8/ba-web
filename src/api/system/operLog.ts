import { request } from "@/utils/service"

const BASE_API = "system-server/sysOperLog"

export const api = {
  save: BASE_API + "/save",
  deleteById: BASE_API + "/deleteById",
  findById: BASE_API + "/findById",
  findPage: BASE_API + "/findPage"
}

/** 新增/编辑 */
export function saveApi(data: any) {
  return request({
    url: api.save,
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
  return request({
    url: api.findById,
    method: "get",
    params
  })
}

/** 分页查询 */
export function findPageApi(data: any) {
  return request({
    url: api.findPage,
    method: "post",
    data
  })
}
