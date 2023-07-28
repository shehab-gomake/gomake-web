import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

import { MoreMenuWidget } from "./widget/more-circle";
import { useStyle } from "./style";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [productSearched, setProductSearched] = useState([]);
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
  useEffect(() => {
    if (allProducts?.length) {
      const temp = matchSorter(allProducts, term, {
        keys: ["name", "code", "details"],
      });
      setProductSearched(temp);
    }
  }, [term, allProducts]);
  return {
    tableHeaders,
    allProducts,
    term,
    productSearched,
    setTerm,
  };
};

export { useSettings };
