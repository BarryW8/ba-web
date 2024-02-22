import { request } from "@/utils/service"
import CommonApi from "@/api/common-api"
import { Model, PageParams, PageResult } from "./types"

const BASE_API = "system-server/sysUser"
const api = {
  add: BASE_API + CommonApi.add,
  edit: BASE_API + CommonApi.edit,
  deleteById: BASE_API + CommonApi.deleteById,
  findById: BASE_API + CommonApi.findById,
  findPage: BASE_API + CommonApi.findPage,
  findUserRole: BASE_API + "/findUserRole",
  saveUserRole: BASE_API + "/saveUserRole",
}

/** 查询用户授权角色信息 */
export function findUserRoleApi(params: { modelId: string }) {
  return request({
    url: api.findUserRole,
    method: "get",
    params
  })
}

/** 保存用户授权角色信息 */
export function saveUserRoleApi(data: any) {
  return request({
    url: api.saveUserRole,
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
  return request<ApiResponseData<Model>>({
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
