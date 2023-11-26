import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB, getAlltProductSKU } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { useRecoilState } from "recoil";
import { permissionsState } from "@/store/permissions";
import { Permissions } from "@/components/CheckPermission/enum";

const useProductManagement = () => {
  const { callApi } = useGomakeAxios();
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [productSearched, setProductSearched] = useState([]);
  const [permissions, setPermissions] = useRecoilState(permissionsState);
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
    const mapData = data?.map((item) => [
      item?.code,
      item?.name,
      item?.details,
      <div style={{ display: "inline-flex" }}>
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
      </div>,
      <div style={{ display: "inline-flex" }}>
        {item?.status === false ? (
          <div style={clasess.inActiveTabStyle}>
            {t("usersSettings.inactive")}
          </div>
        ) : (
          <div style={clasess.activeTabStyle}>{t("usersSettings.active")}</div>
        )}
      </div>,
      <MoreMenuWidget item={item} updatedProduct={updatedProduct} />,
    ]);
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
    permissions && permissions[Permissions.EDIT_PRODUCT] ? t("products.productManagement.admin.more") : null,
  ];
  const filterArray = (array: any, searchText: string) =>
    array.filter((item) => {
      const matches = matchSorter([item[0], item[1]], searchText);
      return matches.length > 0;
    });
  useEffect(() => {
    if (allProducts?.length) {
      const temp = filterArray(allProducts, term);
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
