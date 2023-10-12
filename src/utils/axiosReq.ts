import { http } from "@/utils/http";

export default http.request;

export type Response<T> = {
  code: number;
  detail: string;
  data: T;
};
