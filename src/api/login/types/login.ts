export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

export interface UserInfo {
  id: string
  userName: string
  avatar?: string
  nickName?: string
  realName?: string
  telephone: string
  email?: string
  sex: number | string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{
  token: string
  userId: string
}>

export type UserInfoResponseData = ApiResponseData<UserInfo>
