import { useGomakeAxios } from "@/hooks";
import { getAndSetAllParameters } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widget/more-circle";

const useParameters = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [parameters, setAllParameters] = useState<any>();
  const renderType = (type) => {
    if (type == 1) {
      return "Select";
    } else if (type == 2) {
      return "Input Number";
    } else if (type == 3) {
      return "Input Text";
    } else {
      return "Boolean";
    }
  };
  const getAllParameters = useCallback(async () => {
    const data = await getAndSetAllParameters(callApi, setAllParameters);
    const mapData = data?.map((item: any, index: number) => {
      return {
        // number: index + 1,
        parameter: item?.name,
        values: item.values.map((item, index) => {
          return (
            <div>
              {index + 1} - {item.name}
            </div>
          );
        }),
        type: renderType(item.type),
        more: <MoreMenuWidget />,
        id: item?.id,
      };
    });
    setAllParameters(mapData);
  }, []);
  useEffect(() => {
    getAllParameters();
  }, []);
  const tableHeaders = [
    t("products.parameters.admin.parameter"),
    t("products.parameters.admin.values"),
    t("products.parameters.admin.type"),
    t("products.parameters.admin.more"),
  ];
  return { tableHeaders, parameters, t };
};

export { useParameters };
