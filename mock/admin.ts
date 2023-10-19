import { Response } from "@/utils/axiosReq";
import { IResponseGetMenus, IResponseRoles, IRoleItem } from "@/api/admin.pb";
import { MockMethod } from "vite-plugin-mock";

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
    father_id: 1,
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

const menus: IResponseGetMenus[] = [
  {
    id: "menu-permission",
    label: "权限管理",
    menu_item_type: 1,
    children: [
      {
        id: "menu-permission-user",
        label: "用户管理",
        menu_item_type: 2,
        items: [
          {
            id: "menu-permission-user-add",
            label: "添加用户",
            methods: [
              {
                url: "/v1/users/",
                method: "GET",
                note: "添加用户"
              }
            ]
          },
          {
            id: "menu-permission-user-modify",
            label: "修改用户",
            methods: [
              {
                url: "/v1/user/:id/",
                method: "PATCH"
              }
            ]
          },
          {
            id: "menu-permission-user-ban",
            label: "禁用用户",
            methods: [
              {
                url: "/v1/user/:id/",
                method: "GET"
              }
            ]
          }
        ]
      },
      {
        id: "menu-permission-role",
        label: "角色管理",
        menu_item_type: 2,
        items: [
          {
            id: "menu-permission-role-get",
            label: "搜索",
            methods: [
              {
                url: "/v1/roles/",
                method: "GET",
                note: "获取角色列表"
              }
            ]
          },
          {
            id: "menu-permission-role-modify",
            label: "修改角色",
            methods: [
              {
                url: "/v1/role/:id/",
                method: "PATCH"
              }
            ]
          },
          {
            id: "menu-permission-role-delete",
            label: "删除角色",
            methods: [
              {
                url: "/v1/role/:id/",
                method: "DELETE"
              }
            ]
          }
        ]
      },
      {
        id: "menu-permission-menu",
        label: "菜单管理",
        menu_item_type: 2,
        items: [
          {
            id: "menu-permission-menu-get",
            label: "搜索",
            methods: [
              {
                url: "/v1/menu/",
                method: "GET",
                note: "获取菜单列表"
              }
            ]
          },
          {
            id: "menu-permission-menu-modify",
            label: "修改菜单",
            methods: [
              {
                url: "/v1/menu/:id/",
                method: "PATCH"
              }
            ]
          },
          {
            id: "menu-permission-menu-post",
            label: "添加菜单",
            methods: [
              {
                url: "/v1/menu/:id/",
                method: "POST"
              }
            ]
          },
          {
            id: "menu-permission-menu-delete",
            label: "删除菜单",
            methods: [
              {
                url: "/v1/menus/",
                method: "DELETE"
              }
            ]
          }
        ]
      }
    ]
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
    url: "/v1/menus/",
    method: "get",
    response: (): Response<IResponseGetMenus> => {
      return {
        code: 0,
        detail: "success",
        data: {
          route_list: menus
        }
      };
    }
  }
] as MockMethod[];
