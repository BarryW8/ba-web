import { request } from "@/utils/service"

/** 文件上传 */
export function uploadApi(data: any) {
  return request({
    url: "file-server/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  })
}

/** 获取文件域名 */
export function getBaseUrlApi() {
  return request({
    url: "file-server/getBaseUrl",
    method: "get"
  })
}
