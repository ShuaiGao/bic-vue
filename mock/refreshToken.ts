import { MockMethod } from "vite-plugin-mock";

// 模拟刷新token接口
export default [
  {
    url: "/refreshToken",
    method: "post",
    response: ({ body }) => {
      if (body.refresh_token) {
        return {
          success: true,
          data: {
            token: "eyJhbGciOiJIUzUxMiJ9.newAdmin",
            refresh_token: "eyJhbGciOiJIUzUxMiJ9.newAdminRefresh",
            expires: "2023/10/30 23:59:59"
          }
        };
      } else {
        return {
          success: false,
          data: {}
        };
      }
    }
  }
] as MockMethod[];
