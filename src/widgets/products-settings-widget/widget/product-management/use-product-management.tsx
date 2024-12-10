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
  EProductProfites,
  ProductClient,
} from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { SettingIcon } from "@/widgets/shared-admin-customers";
import { EHttpMethod } from "@/services/api-service/enums";
import { useRouter } from "next/router";
import { getAllSubProducts } from "@/services/hooks/admin-side/products/get-all-sub-products";
import { EnterArrow, PlusIcon } from "@/icons";
import { addProductProfitRuleApi } from "@/services/api-service/products/product-endpoints";
import { EditingIcon } from "../more-circle/icons/editing";

const useProductManagement = () => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState<any>();
  const [term, setTerm] = useState<any>("");
  const [selectedSKU, setSelectedSKU] = useState<string>("");
  const [productSearched, setProductSearched] = useState([]);
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
        id: EProductProfites.BY_ACTION,
      },
      {
        label: t("products.addProduct.admin.product"),
        id: EProductProfites.BY_PRODUCT,
      },
      {
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

    const mapData = data?.map((item) => ({
      row: [
        item?.code,
        item?.name,
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
              placeholder={t("products.addProduct.admin.pricingType")}
              style={classes.dropDownListByTableStyle}
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
          {(item.profitsModal === EProductProfites.BY_PRODUCT ||
            item.profitsModal === EProductProfites.BY_RULE) && (
            <div
              style={{ display: "inline-flex", cursor: "pointer" }}
              onClick={() => {
                item.profitsModal === EProductProfites.BY_PRODUCT
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
    }));
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
    t("products.actions.outSource"),
    t("products.addProduct.admin.subProducts"),
    t("products.productManagement.admin.status"),
    t("products.productManagement.admin.more"),
  ];

  const filterArray = (array: any[], searchText: string, selectedSKU: any) =>
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

      // Ensure that searchText, selectedSKU, and subProducts are matched together
      return (mainMatches.length > 0 || subProductMatches) && selectedSKUMatch;
    });

  useEffect(() => {
    if (allProducts?.length) {
      const temp = filterArray(allProducts, term, selectedSKU);
      setProductSearched(temp);
    }
  }, [term, allProducts, selectedSKU]);

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
    handleClose,
    handleClick,
    open,
    anchorEl,
    onClickClearFilter,
  };
};

export { useProductManagement };
