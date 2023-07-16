import { useGomakeAxios } from "@/hooks";
import { getAllProductsMongoDB } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "./widget/more-circle";
import { useStyle } from "./style";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const getActions = useCallback(async () => {
    const data = await getAllProductsMongoDB(callApi, setAllProducts);
    const mapData = data?.map((item: any) => {
      return {
        code: item?.code,
        name: item?.name,
        details: item?.details,
        groups: (
          <div>
            {item?.groups.map((group) => {
              return (
                <div
                  style={{
                    marginBottom: 5,
                  }}
                >
                  {group.name}
                </div>
              );
            })}
          </div>
        ),

        status: (
          <div>
            {item?.status === false ? (
              <div style={clasess.inActiveTabStyle}>Inactive</div>
            ) : (
              <div style={clasess.activeTabStyle}>Active</div>
            )}
          </div>
        ),
        more: <MoreMenuWidget />,
        id: item?.id,
      };
    });
    setAllProducts(mapData);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tableHeaders = [
    t("products.productManagement.admin.productCode"),
    t("products.productManagement.admin.prouctName"),
    t("products.productManagement.admin.details"),
    t("products.productManagement.admin.groups"),
    t("products.productManagement.admin.status"),
    t("products.productManagement.admin.more"),
  ];
  return { tableHeaders, allProducts };
};

export { useSettings };
