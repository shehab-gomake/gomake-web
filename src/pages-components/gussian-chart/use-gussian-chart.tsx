import { useGomakeAxios } from "@/hooks";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { getProfitsChartDataApi } from "@/services/api-service/generic-doc/orders-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useGaussianChart = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { productList } = useAllProductsDropDownList();
  const [productId, setProductId] = useState<string | null>(null);

  const [chartData, setChartData] = useState({
    pointsX: [],
    pointsY: [],
    userPrices: [],
    calculatedPrices: [],
    userPricesCosts: [],
    calculatedPricesCosts: [],
  });

  const getProfitsChartData = async (productId?: string) => {
    const callBack = (res) => {
      if (res?.success) {
        setChartData(res?.data);
      }
    };
    await getProfitsChartDataApi(callApi, callBack, { productId });
  };

  const onChangeProductId = (_event: any, value: { value: string } | null) => {
    setProductId(value?.value || null);
  };

  return {
    t,
    getProfitsChartData,
    chartData,
    productList,
    onChangeProductId,
    productId,
    dir,
    isRTL,
  };
};

export { useGaussianChart };
