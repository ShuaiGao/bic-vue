// Code generated by protoc-gen-bic. DO NOT EDIT.
// versions: 2.0.3

import request, { Response } from "@/utils/axiosReq";
import { IEmpty } from "./common.pb";

export enum EUserBanStatus {
  ban_none = 0,
  ban_available = 1,
  ban_forbidden = 2
}
export interface IRequestUsers {
  page: number | null; // 页码
  page_size: number | null; // 每页数量
  username?: string | null;
  email?: string | null;
  ban?: EUserBanStatus | null;
}

export interface IUser {
  id: number | null; // 主键ID
  username?: string | null; // 用户名
  name?: string | null; // 姓名
  email: string | null; // 邮箱
  update_time: number | null; // 活跃时间戳
  ban?: boolean | null; // 账号是否禁用
}

export interface IResponseUsers {
  page?: number | null;
  page_size?: number | null;
  total?: number | null;
  data_list?: IUser[] | null;
}

export interface IRequestPatchPermission {
  role_id?: number | null;
}

// 获取用户列表
export function GetUsers(
  params: IRequestUsers
): Promise<Response<IResponseUsers>> {
  return request({
    url: "/v1/users",
    method: "GET",
    params
  });
}

/**
 * 修改用户权限
 * @Param { number } id -
 */
export function PatchUserPermission(
  id: number,
  data: IRequestPatchPermission
): Promise<Response<IEmpty>> {
  return request({
    url: "/v1/user/" + id,
    method: "PATCH",
    data
  });
}
