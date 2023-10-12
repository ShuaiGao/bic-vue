// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";
import { IResponseUsers, IUser } from "@/api/user.pb";
import { Response } from "@/utils/axiosReq";

const users: IUser[] = [
  {
    id: 1,
    username: "gaozijia",
    name: "高子嘉",
    email: "gaozijia@bic.com",
    update_time: new Date().getTime()
  },
  {
    id: 2,
    username: "dongua",
    name: "冬瓜",
    email: "dongua@bic.com",
    update_time: new Date().getTime()
  },
  {
    id: 3,
    username: "libai",
    name: "李白",
    email: "libai@bic.com",
    update_time: new Date().getTime(),
    ban: true
  },
  {
    id: 4,
    username: "dufu",
    name: "杜甫",
    email: "dufu@bic.com",
    update_time: new Date().getTime()
  }
];

export default [
  {
    url: "/v1/users/",
    method: "get",
    response: (): Response<IResponseUsers> => {
      return {
        code: 0,
        detail: "success",
        data: {
          data_list: users,
          total: 123
        }
      };
    }
  }
] as MockMethod[];
