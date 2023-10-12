import moment from "moment";

export function getTimeStr(timestamp: number): string {
  return moment(new Date(timestamp)).format("YYYY-MM-DD HH:mm:ss");
}
