// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/v1/auth",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          code: 0,
          message: "success",
          success: true,
          data: {
            username: "admin",
            // 一个用户可能有多个角色
            roles: ["admin"],
            token: "eyJhbGciOiJIUzUxMiJ9.admin",
            token_refresh: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      } else {
        return {
          code: 0,
          message: "success",
          success: true,
          data: {
            username: "common",
            // 一个用户可能有多个角色
            roles: ["common"],
            token: "eyJhbGciOiJIUzUxMiJ9.common",
            token_refresh: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      }
    }
  }
] as MockMethod[];
