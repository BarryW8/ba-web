const BASE_API = "system-server/sysUser"

export const api = {
  findUserRole: BASE_API + "/findUserRole",
  saveUserRole: BASE_API + "/saveUserRole",
  save: BASE_API + "/save",
  deleteById: BASE_API + "/deleteById",
  findById: BASE_API + "/findById",
  findPage: BASE_API + "/findPage"
}

export default api
