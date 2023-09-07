import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB, getAlltProductSKU } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";

const useProductManagement = () => {
  const { callApi } = useGomakeAxios();
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [productSearched, setProductSearched] = useState([]);
  const [allProductSKU, setAllProductSKU] = useState<any>();
  const getAllProductsSKU = useCallback(async () => {
    await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);
  const updatedProduct = useCallback(async (product: any) => {
    const res: any = await callApi(
      "PUT",
      `/v1/printhouse-config/products/update-product-status`,
      {
        Id: product.id,
        status: !product?.status,
      }
    );
    if (res?.success) {
      getActions();
      return true;
    } else {
      return false;
    }
  }, []);

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
        more: <MoreMenuWidget item={item} updatedProduct={updatedProduct} />,
        id: item?.id,
      };
    });
    setAllProducts(mapData);
  }, []);
  useEffect(() => {
    getActions();
    getAllProductsSKU();
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
    allProductSKU,
    setTerm,
  };
};

export { useProductManagement };
