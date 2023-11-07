// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

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
      key: "/permission/menu/index",
      path: "/permission/menu/index",
      name: "PermissionButton",
      meta: {
        title: "菜单权限"
      }
    }
  ]
};

export default [
  {
    url: "/v1/routes/",
    method: "get",
    response: () => {
      return {
        code: 0,
        detail: "success",
        data: {
          item_list: [permissionRouter]
        }
      };
    }
  }
] as MockMethod[];
