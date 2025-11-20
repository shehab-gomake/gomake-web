import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";
import { getAllProductsMongoDB, getAlltProductSKU } from "@/services/hooks";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { GoMakeAutoComplate } from "@/components";
import {
  EProductClient,
  EProductProfits,
  ProductClient,
} from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { SettingIcon } from "@/widgets/shared-admin-customers";
import { EHttpMethod } from "@/services/api-service/enums";
import { useRouter } from "next/router";
import { getAllSubProducts } from "@/services/hooks/admin-side/products/get-all-sub-products";
import { EnterArrow, PlusIcon } from "@/icons";
import { addProductProfitRuleApi } from "@/services/api-service/products/product-endpoints";
import { EditingIcon } from "../more-circle/icons/editing";
import { useAllProductTypesDropDownList } from "@/hooks/use-product-types-drop-down-list";

const useProductManagement = () => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [selectedSKU, setSelectedSKU] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [productSearched, setProductSearched] = useState([]);
  const { allProductTypes } = useAllProductTypesDropDownList();
  const [selectProfitsModal, setSelectProfitsModal] = useState<ProductClient>();
  const { navigate } = useGomakeRouter();
  const [allProductSKU, setAllProductSKU] = useState<any>();
  const [openAddProfitRule, setOpenProfitRule] = useState<boolean>(false);
  const [productAddProfitRuleId, setProductAddProfitRuleId] =
    useState<string>("");
  const [openEditProfitRule, setEditProfitRule] = useState<boolean>(false);
  const [editProductId, setEditProductId] = useState<string>("");
  const getAllProductsSKU = useCallback(async () => {
    await getAlltProductSKU(callApi, setAllProductSKU);
  }, []);
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        id: EProductProfits.BY_ACTION,
      },
      {
        label: t("products.addProduct.admin.product"),
        id: EProductProfits.BY_PRODUCT,
      },
      {
        label: t("products.profits.profitByRule"),
        id: EProductProfits.BY_RULE,
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

    const mapData = data?.map((item) => {
      // Find template name by templateId
      const templateId =
        typeof item?.templateId === "object"
          ? item?.templateId?.id
          : item?.templateId;
      const template = allProductTypes?.find((t: any) => t.id === templateId);
      const templateName = template?.label || template?.name || "";

      return {
        row: [
          item?.code,
          item?.name,
          templateName,
          _renderPricingType(item.pricingType),
          <div style={classes.profitProductsCellStyle}>
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
                placeholder={""}
                style={classes.dropDownListByTableStyle}
                value={productProfitesList?.find(
                  (profit) => profit.id === item.profitsModal
                )}
                disableClearable={true}
                onChange={(e: any, value: any) => {
                  setSelectProfitsModal(value);
                  UpdateProfitsModal(item, value);
                  if (value?.id === EProductProfits.BY_RULE) {
                    setOpenProfitRule(true);
                    setProductAddProfitRuleId(item?.id);
                  }
                }}
              />
            </div>
            {(item.profitsModal === EProductProfits.BY_PRODUCT ||
              item.profitsModal === EProductProfits.BY_RULE) && (
              <div
                style={{ display: "inline-flex", cursor: "pointer" }}
                onClick={() => {
                  item.profitsModal === EProductProfits.BY_PRODUCT
                    ? window.open(
                        `/products/profits?productId=${item?.id}&productName=${item?.name}`,
                        "_blank"
                      )
                    : setEditProfitRule(true);
                  setEditProductId(item?.id);
                }}
              >
                <SettingIcon />
              </div>
            )}
          </div>,
          <div
            style={{ display: "inline-flex" }}
            onClick={() => {
              window.open(
                `/products/profits?productId=${item?.id}&productName=${item?.name}&isOutSource=true`,
                "_blank"
              );
            }}
          >
            {item?.isHaveOutSourceSettings ? (
              <div
                style={{
                  display: "inline-flex",
                  cursor: "pointer",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <EditingIcon />
                {t("materials.buttons.edit")}
              </div>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  cursor: "pointer",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <PlusIcon stroke="#8283BE" /> {t("materials.buttons.add")}{" "}
              </div>
            )}
          </div>,
          <div
            style={classes.subPrductContainer}
            onClick={(e: any) =>
              item.subProductsCount > 0 &&
              navigate(
                `/settings/products/sub-product/${item?.id}?productName=${item?.name}&isSubProducts=true`
              )
            }
          >
            <EnterArrow stroke="#8283BE" />
            <div style={{ width: 35 }}>{item?.subProductsCount}</div>
          </div>,

          <div style={{ display: "inline-flex" }}>
            {item?.status === false ? (
              <div style={classes.inActiveTabStyle}>
                {t("usersSettings.inactive")}
              </div>
            ) : (
              <div style={classes.activeTabStyle}>
                {t("usersSettings.active")}
              </div>
            )}
          </div>,
          <MoreMenuWidget
            item={item}
            updatedProduct={updatedProduct}
            getActions={getActions}
          />,
        ],
        subProducts: item?.subProducts,
        templateId: templateId,
      };
    });
    setAllProducts(mapData);
  }, [allProductTypes]);

  useEffect(() => {
    getActions();
    getAllProductsSKU();
  }, [getActions, getAllProductsSKU]);

  const tableHeaders = [
    t("products.productManagement.admin.productCode"),
    t("products.productManagement.admin.prouctName"),
    t("products.addProduct.admin.pricingType"),
    t("products.addProduct.admin.byCustomerGroup"),
    t("tabs.profits"),
    t("products.actions.outSource"),
    t("products.addProduct.admin.subProducts"),
    t("products.productManagement.admin.status"),
    t("products.productManagement.admin.more"),
  ];

  const filterArray = (
    array: any[],
    searchText: string,
    selectedSKU: any,
    selectedTemplateId: any
  ) =>
    array.filter((item) => {
      // Search in main product fields (first two cells :  code and name)
      const mainMatches = matchSorter(item.row.slice(0, 2), searchText);

      // Search in subProducts fields
      const subProductMatches = item?.subProducts?.some((subProduct: any) =>
        subProduct?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );

      // Search for selectedSKU match in the first cell of the row
      const selectedSKUMatch = selectedSKU
        ? String(item?.row?.[0]) === String(selectedSKU)
        : true;

      // Search for selectedTemplateId match
      const selectedTemplateMatch = selectedTemplateId
        ? String(item?.templateId) === String(selectedTemplateId)
        : true;

      // Ensure that searchText, selectedSKU, selectedTemplateId, and subProducts are matched together
      return (
        (mainMatches.length > 0 || subProductMatches) &&
        selectedSKUMatch &&
        selectedTemplateMatch
      );
    });

  useEffect(() => {
    if (allProducts?.length) {
      const temp = filterArray(
        allProducts,
        term,
        selectedSKU,
        selectedTemplateId
      );
      setProductSearched(temp);
    }
  }, [term, allProducts, selectedSKU, selectedTemplateId]);

  const handleGoBack = () => {
    router.back();
  };

  const addProductProfitRule = async (data) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
      } else {
        alertFaultAdded();
      }
    };
    await addProductProfitRuleApi(callApi, callBack, {
      ...data,
      productId: productAddProfitRuleId,
    });
  };

  const onClickClearFilter = () => {
    setSelectedSKU("");
    setSelectedTemplateId("");
  };

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
    setProductAddProfitRuleId,
    selectedSKU,
    setSelectedSKU,
    selectedTemplateId,
    setSelectedTemplateId,
    allProductTypes,
    handleClose,
    handleClick,
    open,
    anchorEl,
    onClickClearFilter,
  };
};

export { useProductManagement };
