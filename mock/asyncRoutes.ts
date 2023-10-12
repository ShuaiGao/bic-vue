// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";
import { IResponseRoles, IRoleItem } from "@/api/admin.pb";
import { Response } from "@/utils/axiosReq";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      key: "/permission/page/index",
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "角色管理",
        roles: ["admin", "common"]
      }
    },
    {
      key: "/permission/user/index",
      path: "/permission/user/index",
      name: "PermissionRole",
      meta: {
        title: "用户管理"
      }
    },
    {
      key: "/permission/button/index",
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"],
        auths: ["btn_add", "btn_edit", "btn_delete"]
      }
    }
  ]
};

const roles: IRoleItem[] = [
  {
    id: 1,
    name: "管理员",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉"
  },
  {
    id: 2,
    name: "客服部门主管",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 1,
    father_name: "管理员"
  },
  {
    id: 3,
    name: "客服部门组长",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 2,
    father_name: "客服部门主管"
  },
  {
    id: 4,
    name: "客服部门成员",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 3,
    father_name: "客服部门组长"
  },
  {
    id: 5,
    name: "销售部门主管",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 3,
    father_name: "客服部门组长"
  },
  {
    id: 6,
    name: "销售部门组长",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 5,
    father_name: "销售部门组长"
  },
  {
    id: 7,
    name: "运维部门主管",
    create_time: new Date().getTime(),
    create_user: "子嘉",
    update_time: new Date().getTime(),
    update_user: "子嘉",
    father_id: 1,
    father_name: "管理员"
  }
];

export default [
  {
    url: "/v1/roles/",
    method: "get",
    response: (): Response<IResponseRoles> => {
      return {
        code: 0,
        detail: "success",
        data: {
          data_list: roles
        }
      };
    }
  },
  {
    url: "/v1/routes/",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [permissionRouter]
      };
    }
  }
] as MockMethod[];
