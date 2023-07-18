import { request } from "@/utils/service"
import Api from "./api"
import { Model, PageParams, PageResult } from "./types"

/** 查询用户授权角色信息 */
export function findUserRoleApi(params: { modelId: string }) {
  return request({
    url: Api.findUserRole,
    method: "get",
    params
  })
}

/** 保存用户授权角色信息 */
export function saveUserRoleApi(data: any) {
  return request({
    url: Api.saveUserRole,
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
  return request<ApiResponseData<Model>>({
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
