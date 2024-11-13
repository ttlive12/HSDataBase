import request from "./request";
import { RankDataResponse } from "./type";

export const getRankData = async () => {
  return await request<RankDataResponse>({
    url: "https://ilw6383kw0.hzh.sealos.run/getRankData",
    method: "GET",
    showLoading: true,
  });
};
