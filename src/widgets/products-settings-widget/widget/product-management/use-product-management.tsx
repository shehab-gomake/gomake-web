import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB, getAlltProductSKU } from "@/services/hooks";
import {useGomakeAxios, useGomakeRouter, useSnackBar} from "@/hooks";

import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { GoMakeAutoComplate } from "@/components";
import {
  EProductClient,
  EProductProfites,
  ProductClient,
} from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { SettingIcon } from "@/widgets/shared-admin-customers";
import { EHttpMethod } from "@/services/api-service/enums";
import { useRouter } from "next/router";
import { getAllSubProducts } from "@/services/hooks/admin-side/products/get-all-sub-products";
import { EnterArrow } from "@/icons";
import {addProductProfitRuleApi} from "@/services/api-service/products/product-endpoints";

const useProductManagement = () => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [productSearched, setProductSearched] = useState([]);
  const [selectProfitsModal, setSelectProfitsModal] = useState<ProductClient>();
  const { navigate } = useGomakeRouter();
  const [allProductSKU, setAllProductSKU] = useState<any>();
  const [openAddProfitRule, setOpenProfitRule] = useState<boolean>(false);
  const [productAddProfitRuleId, setProductAddProfitRuleId] = useState<string>('')
  const [openEditProfitRule, setEditProfitRule] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<string>('')
  const getAllProductsSKU = useCallback(async () => {
    await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);
  const {alertFaultAdded, alertSuccessAdded} = useSnackBar();
  const updatedProduct = useCallback(async (product: any) => {
    const res: any = await callApi(
      EHttpMethod.PUT,
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
  const UpdateProfitsModal = useCallback(async (product: any, profitsModal) => {
    const res: any = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/products/update-profits-modal`,
      {
        id: product?.id,
        profitsModal: profitsModal?.id,
      }
    );
    if (res?.success) {
      getActions();
      return true;
    } else {
      return false;
    }
  }, []);
  const _renderPricingType = (item: number) => {
    if (item === EProductClient.BY_CLIENT_TYPE) {
      return t("products.addProduct.admin.byClientType");
    } else if (item === EProductClient.BY_CLIENT) {
      return t("products.addProduct.admin.byClient");
    } else if (item === EProductClient.ALL_CUSTOMERS) {
      return t("products.addProduct.admin.allCustomers");
    }
  };
  const productProfitesList: ProductClient[] = useMemo(
    () => [
      {
        label: t("partners.options.action"),
        id: EProductProfites.BY_ACTION,
      },
      {
        label: t("products.addProduct.admin.product"),
        id: EProductProfites.BY_PRODUCT,
      },  {
        label: t("products.profits.profitByRule"),
        id: EProductProfites.BY_RULE,
      },
    ],
    []
  );
  const getActions = useCallback(async () => {
    const data = router.query.productId
      ? await getAllSubProducts(callApi, setAllProducts, {
        productId: router.query.productId,
      })
      : await getAllProductsMongoDB(callApi, setAllProducts);

    const mapData = data?.map((item) => [
      item?.code,
      item?.name,
      _renderPricingType(item.pricingType),
      <div style={clasess.profitProductsCellStyle}>
        <div
          style={{
            textAlignLast: "center",
            width: 100,
            display: "inline-table",
          }}
        >
          <GoMakeAutoComplate
            key={item?.id}
            options={productProfitesList}
            placeholder={t("products.addProduct.admin.pricingType")}
            style={clasess.dropDownListByTableStyle}
            value={productProfitesList?.find(
              (profit) => profit.id === item.profitsModal
            )}
            disableClearable={true}
            onChange={(e: any, value: any) => {
              setSelectProfitsModal(value);
              UpdateProfitsModal(item, value);
              if (value?.id === EProductProfites.BY_RULE) {
                setOpenProfitRule(true);
                setProductAddProfitRuleId(item?.id);
              }
            }}
          />
        </div>
        {(item.profitsModal === EProductProfites.BY_PRODUCT || item.profitsModal === EProductProfites.BY_RULE) && (
          <div
            style={{ display: "inline-flex", cursor: "pointer" }}
            onClick={() => {
              item.profitsModal === EProductProfites.BY_PRODUCT ?
              window.open(
                `/products/profits?productId=${item?.id}&productName=${item?.name}`,
                "_blank"
              ) :
              setEditProfitRule(true);
              setEditProductId(item?.id);
            }}
          >
            <SettingIcon />
          </div>
        )}
      </div>,
      <div
        style={clasess.subPrductContainer}
        onClick={(e: any) =>
          item.subProductsCount > 0 &&
          navigate(
            `/settings/products/sub-product/${item?.id}?productName=${item?.name}`
          )
        }
      >
        <div style={{ width: 35 }}>{item?.subProductsCount}</div>
        <EnterArrow />
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
      <MoreMenuWidget item={item} updatedProduct={updatedProduct} getActions={getActions} />,
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
    t("products.addProduct.admin.pricingType"),
    t("tabs.profits"),
    t("products.addProduct.admin.subProducts"),
    t("products.productManagement.admin.status"),
    t("products.productManagement.admin.more"),
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
  const handleGoBack = () => {
    router.back();
  };

  const addProductProfitRule = async (data) => {
    const callBack = res => {
      if (res.success) {
        alertSuccessAdded();
      }else {
        alertFaultAdded();
      }
    }
    await addProductProfitRuleApi(callApi, callBack, {...data, productId: productAddProfitRuleId});
  }
  return {
    tableHeaders,
    allProducts,
    term,
    productSearched,
    allProductSKU,
    router,
    setTerm,
    handleGoBack,
    openAddProfitRule,
    openEditProfitRule,
    setEditProfitRule,
    setOpenProfitRule,
    addProductProfitRule,
    editProductId,
    setEditProductId,
    setProductAddProfitRuleId
};
};

export { useProductManagement };
