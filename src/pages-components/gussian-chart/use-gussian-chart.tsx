import { useGomakeAxios } from "@/hooks";
import { getProfitsChartDataApi } from "@/services/api-service/generic-doc/orders-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useGaussianChart = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [chartData, setChartData] = useState({
    pointsX: [],
    pointsY: [],
    userPrices: [],
    calculatedPrices: [],
    userPricesCosts: [],
    calculatedPricesCosts: [],
  });

  const getProfitsChartData = async () => {
    const callBack = (res) => {
      if (res?.success) {
        // setChartData({
        //   pointsX: res?.data?.pointsX,
        //   pointsY: res?.data?.pointsY,
        //   userPrices: res?.data?.userPrices,
        //   calculatedPrices: res?.data?.calculatedPrices,
        //   userPricesCosts: res?.data?.userPricesCosts,
        //   calculatedPricesCosts: res?.data?.calculatedPricesCosts,
        // });
        setChartData(res?.data);
      }
    };
    await getProfitsChartDataApi(callApi, callBack);
  };

  return {
    t,
    getProfitsChartData,
    chartData,
  };
};

export { useGaussianChart };
