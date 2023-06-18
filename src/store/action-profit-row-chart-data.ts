import { atom } from "recoil";

export const chartDataByActionProfitRow = atom({
  key: "chartDataByActionProfitRow",
  default: {
    xAxis: [],
    yAxis: [],
  },
});
