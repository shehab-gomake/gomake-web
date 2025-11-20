import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeDialog,
  GomakeTextInput,
} from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import { useStyle } from "./style";
import { Divider, Popover, Skeleton } from "@mui/material";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote-new/store/quote";
import Stack from "@mui/material/Stack";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useClientTypesList } from "@/hooks/use-client-types";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import { ModalType } from "@/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { getHeadingTypography } from "@/utils/typography-utils";
import { PrimaryButton } from "@/components/button/primary-button";
import { EProductStructureType } from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { ProductCategoryType } from "./states";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getCompositeProductById } from "@/services/hooks/admin-side/products/get-set-product-by-id";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { addCompositeProductsApi } from "@/services/api-service/generic-doc/documents-api";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface QuoteWidgetProps {
  isMobileScreen?: boolean;
  title?: string;
}

const QuoteWidget = ({ isMobileScreen = false, title }: QuoteWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const { getClientTypesCategories } = useClientTypesList();
  const { CheckPermission } = useUserPermission();

  const {
    clientTypesValue,
    id,
    anchorEl,
    isDisabled,
    handleClick,
    onClickCreateQuoteForCustomer,
    open,
    openModal,
    onClickSaveQuote,
    userQuote,
    selectedClientType,
    selectedClient,
    onClickCloseModal,
    _renderErrorMessage,
    handleClose,
    setSelectedClientType,
    setSelectedClient,
    checkWhatRenderArray,
    handleClickToSelectedCustomer,
    renderOptions,
    openCustomerModal,
    customer,
    setCustomer,
    onCustomerAdd,
    onClickAddCustomer,
    onCloseCustomerModal,
    handleCancel,
    setOpenModal,
    QuoteId,
    setQuoteId,
    getAndSetExistQuote,
    getAllClientTypes,
    combinedData,
    selectedProduct,
    handleProductChange,
    isFetching,
    selectedTab,
    onSelectTab,
    listClient,
    onclickCreateNew,
    onCustomerAddFromOption,
    navigate,
  } = useQuoteWidget();
  const { secondColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [compositeDialogOpen, setCompositeDialogOpen] = useState(false);
  const [isSubmittingComposite, setIsSubmittingComposite] = useState(false);
  const [compositeProducts, setCompositeProducts] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    jobName: string;
    baseQuantity: number; // Original quantity from backend
    isManuallyEdited: boolean; // Track if user manually edited this product's quantity
    isJobNameManuallyEdited: boolean; // Track if user manually edited this product's jobName
  }>>([]);
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);
  const [mainJobName, setMainJobName] = useState<string>("");
  const [isLoadingCompositeProducts, setIsLoadingCompositeProducts] = useState(false);
  const [compositeErrors, setCompositeErrors] = useState<{
    [key: string]: {
      quantity?: string;
      jobName?: string;
    };
  }>({});
  const [mainFieldErrors, setMainFieldErrors] = useState<{
    quantity?: string;
    jobName?: string;
  }>({});

  console.log("selectedClientType", {
    compositeProducts, selectedClientType,
    selectedClient,
  });

  const isCompositeSelectedProduct =
    selectedProduct?.category === ProductCategoryType.PRODUCT &&
    selectedProduct?.productStructureType === EProductStructureType.COMPOSITE;

  const openCompositeDialog = async () => {
    setCompositeErrors({});
    setMainFieldErrors({});
    setCompositeDialogOpen(true);

    if (selectedProduct?.id) {
      setIsLoadingCompositeProducts(true);
      try {
        const result = await getCompositeProductById(callApi, null, {
          Id: selectedProduct.id,
        });

        // Handle different possible response structures
        let productsData = null;
        if (Array.isArray(result)) {
          productsData = result;
        } else if (result?.data) {
          productsData = Array.isArray(result.data) ? result.data : result.data.data;
        }

        if (productsData && Array.isArray(productsData)) {
          // Map the API response to our state structure
          const baseQty = productsData[0]?.quantity || 1;
          const products = productsData.map((product: any) => ({
            id: product.id,
            name: product.name,
            baseQuantity: product.quantity || 1,
            quantity: product.quantity || 1,
            jobName: product.jobName || "",
            isManuallyEdited: false,
            isJobNameManuallyEdited: false,
          }));
          setCompositeProducts(products);
          setQuantityMultiplier(1);
        } else {
          setCompositeProducts([]);
          setQuantityMultiplier(1);
        }
      } catch (error) {
        console.error("Error fetching composite products:", error);
        setCompositeProducts([]);
      } finally {
        setIsLoadingCompositeProducts(false);
      }
    }
  };

  const handleCompositeCancel = () => {
    if (isSubmittingComposite) {
      return;
    }
    setCompositeDialogOpen(false);
    setCompositeErrors({});
    setMainFieldErrors({});
    setCompositeProducts([]);
    setQuantityMultiplier(1);
    setMainJobName("");
  };

  const handleMainJobNameChange = (value: string) => {
    setMainJobName(value);

    // Clear error for main job name field
    if (mainFieldErrors.jobName) {
      setMainFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.jobName;
        return updated;
      });
    }

    // Update job names for products that haven't been manually edited
    // Only update products with empty jobName from BE or that were set from main field
    setCompositeProducts((prev) =>
      prev.map((product) => {
        // Only update if jobName hasn't been manually edited
        if (!product.isJobNameManuallyEdited) {
          return {
            ...product,
            jobName: value,
          };
        }
        return product;
      })
    );
  };

  const handleMultiplierChange = (value: number) => {
    setQuantityMultiplier(value);

    // Clear error for main quantity field
    if (mainFieldErrors.quantity) {
      setMainFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.quantity;
        return updated;
      });
    }

    // Update ALL products when multiplier changes (reset manual edits)
    setCompositeProducts((prev) =>
      prev.map((product) => ({
        ...product,
        quantity: product.baseQuantity * value,
        isManuallyEdited: false, // Reset manual edit flag so multiplier affects all products
      }))
    );
  };

  const handleProductQuantityChange = (index: number, value: number) => {
    setCompositeProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: value,
        isManuallyEdited: true, // Mark as manually edited
      };
      return updated;
    });

    // Clear error for this field
    if (compositeErrors[`${index}`]?.quantity) {
      setCompositeErrors((prev) => {
        const updated = { ...prev };
        if (updated[`${index}`]) {
          const productErrors = { ...updated[`${index}`] };
          delete productErrors.quantity;
          if (Object.keys(productErrors).length === 0) {
            delete updated[`${index}`];
          } else {
            updated[`${index}`] = productErrors;
          }
        }
        return updated;
      });
    }
  };

  const updateCompositeProduct = (index: number, field: "jobName", value: string) => {
    setCompositeProducts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        isJobNameManuallyEdited: true, // Mark as manually edited
      };
      return updated;
    });

    // Clear error for this field
    if (compositeErrors[`${index}`]?.[field]) {
      setCompositeErrors((prev) => {
        const updated = { ...prev };
        if (updated[`${index}`]) {
          const productErrors = { ...updated[`${index}`] };
          delete productErrors[field];
          if (Object.keys(productErrors).length === 0) {
            delete updated[`${index}`];
          } else {
            updated[`${index}`] = productErrors;
          }
        }
        return updated;
      });
    }
  };

  const handleCompositeConfirm = async () => {
    const errors: { [key: string]: { quantity?: string; jobName?: string } } = {};
    let hasErrors = false;

    // Validate each product
    compositeProducts.forEach((product, index) => {
      const productErrors: { quantity?: string; jobName?: string } = {};

      // Validate quantity
      if (!product.quantity || product.quantity <= 0) {
        productErrors.quantity = t("products.addProduct.admin.quantityRequired");
        hasErrors = true;
      }

      if (Object.keys(productErrors).length > 0) {
        errors[`${index}`] = productErrors;
      }
    });

    if (hasErrors) {
      setCompositeErrors(errors);
      return;
    }


    setIsSubmittingComposite(true);

    const callBack = (res: any) => {
      setIsSubmittingComposite(false);
      if (res?.success) {
        setCompositeDialogOpen(false);
        setCompositeErrors({});
        setMainFieldErrors({});
        setCompositeProducts([]);
        setQuantityMultiplier(1);
        setMainJobName("");
        alertSuccessAdded();
        // Navigate to cart/quote page
        navigate("/quote");
      } else {
        alertFaultAdded();
      }
    };

    await addCompositeProductsApi(
      callApi,
      callBack,
      {
        documentType: DOCUMENT_TYPE.quote,
        clientId: selectedClient?.id,
        clientTypeId: selectedClientType?.id,
        // orderId: QuoteId,
        compositeProducts: compositeProducts.map((p) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          jobName: p.jobName,
        })),
      }
    );
  };

  const handleCreateCompositeAware = () => {
    if (isCompositeSelectedProduct) {
      openCompositeDialog();
      return;
    }
    onClickCreateQuoteForCustomer();
  };

  const handlePrimaryButtonClick = () => {
    if (!selectedProduct?.id) {
      onclickCreateNew();
      return;
    }
    handleCreateCompositeAware();
  };

  useEffect(() => {
    if (userQuote) {
      setQuoteId(userQuote.id);
      setQuoteNumber(userQuote.number);
      setQuoteIfExist(true);
      setSelectedClient(userQuote.client);
      // Only set client type if clientTypesValue is loaded
      if (clientTypesValue?.length > 0) {
        const clientType = clientTypesValue.find(
          (c) => c.id == userQuote?.client?.clientTypeId
        );
        setSelectedClientType(clientType);
      }
    } else {
      setQuoteId(null);
      setQuoteNumber(null);
      setQuoteIfExist(false);
    }
  }, [userQuote, clientTypesValue]);

  // this for select customer in home page
  useEffect(() => {
    const fetchData = async () => {
      await getAllClientTypes();
      getAndSetExistQuote();
    };
    fetchData();
  }, []);

  useEffect(() => {
    // it for customer card
    getClientTypesCategories();
  }, []);

  useEffect(() => {
    if (!CheckPermission(Permissions.CAN_SELECT_CLIENT_IN_HOME_PAGE)) {
      const options = renderOptions();
      if (options.length > 0) {
        handleClickToSelectedCustomer(userQuote?.client?.id, options[0]);
      }
    }
  }, [listClient]);

  const defaultTitle = QuoteId
    ? t("home.admin.addNewItemToQuote") + " " + QuoteId
    : t("home.admin.startQuote");

  const displayTitle = title || defaultTitle;

  return (
    <div
      style={{
        ...classes.mainContainer,
        ...(isMobileScreen
          ? { marginTop: 10, margin: "10px 0px 0px 0px" }
          : {}),
      }}
    >
      <div style={getHeadingTypography()}>{title}</div>
      <PermissionCheck
        userPermission={Permissions.CAN_SELECT_CLIENT_IN_HOME_PAGE}
      >
        <div style={classes.customerSectionStyle}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "65%" }}>
              <ClientAutocomplete
                disableClearable={true}
                options={renderOptions() ? renderOptions() : []}
                style={classes.selectCustomerContainer}
                getOptionLabel={(option: any) =>
                  option && option.name ? `${option.code} - ${option.name}` : ""
                }
                defaultFiltering={false}
                onChangeTextField={checkWhatRenderArray}
                value={selectedClient}
                loading={isFetching}
                onChange={(e: any, value: any) => {
                  handleClickToSelectedCustomer(
                    userQuote?.client?.id,
                    value
                  ).then();
                }}
                onAddCustomer={onCustomerAddFromOption}
              />
            </div>
            {selectedClient?.id && (
              <div
                style={{
                  width: "30%",
                  opacity: selectedClient?.id ? 1 : 0,
                  transform: selectedClient?.id
                    ? "translateX(0)"
                    : "translateX(-10px)",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <GoMakeAutoComplate
                  options={clientTypesValue}
                  placeholder={t("home.admin.selectCostumerType")}
                  style={classes.selectTypeContainer}
                  getOptionLabel={(option: any) =>
                    option?.name ? option.name : ""
                  }
                  onChange={(e: any, value: any) => {
                    setSelectedClientType(value);
                  }}
                  value={selectedClientType}
                />
              </div>
            )}
          </div>
          <PermissionCheck userPermission={Permissions.ADD_CLIENT}>
            <button
              style={classes.autoButtonStyle}
              onClick={onClickAddCustomer}
            >
              {t("customers.buttons.AddOrSearch")}
            </button>
          </PermissionCheck>
        </div>
      </PermissionCheck>
      <div style={classes.autoComplateRowContainer}>
        <div style={{ width: isMobileScreen ? "100%" : "65%" }}>
          <GoMakeTreeSelect
            selectedTab={selectedTab}
            setSelectedTab={onSelectTab}
            value={selectedProduct}
            options={combinedData}
            onChange={handleProductChange}
            placeholder={t("home.admin.selectProductOrMaterial")}
          />
        </div>
      </div>
      {userQuote ? (
        <Stack direction={"row"} gap={"13px"} width={"100%"}>
          <div style={classes.btnContainer}>
            <PermissionCheck userPermission={Permissions.CREATE_QUOTES}>
              <PrimaryButton
                onClick={handleCreateCompositeAware}
                variant="contained"
                style={{ width: "100%", height: 40 }}
              >
                {t("home.admin.AddItemToQuote")}
              </PrimaryButton>
            </PermissionCheck>
          </div>
          <div style={{ width: "50%" }}>
            <SecondaryButton
              variant="contained"
              style={{ width: "100%", height: 40 }}
              onClick={() => {
                onClickSaveQuote(QuoteId)
                  .then(() => setSelectedClient(null))
                  .then(() => setSelectedClientType(null));
              }}
            >
              {t("home.admin.SaveQuote")}
            </SecondaryButton>
          </div>
        </Stack>
      ) : (
        <div
          style={{
            width: "var(--theme-button-full-width, 50%)",
            maxWidth: "600px",
          }}
        >
          <PrimaryButton
            onClick={handlePrimaryButtonClick}
            variant="contained"
            style={{ width: "100%", height: 40 }}
          >
            {t("home.admin.createQoute")}
          </PrimaryButton>
        </div>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={classes.errorMsgStyle}>{_renderErrorMessage()}</div>
      </Popover>
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleMessage")}
        subTitle={t("sales.quote.MessageForClient")}
        yesBtn={t("sales.quote.Confirm")}
        openModal={openModal}
        onClose={onClickCloseModal}
        onClickDelete={() => onClickSaveQuote(QuoteId)}
        onClickCancel={handleCancel}
      />
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.CUSTOMER}
        codeFlag={false}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        onClose={onCloseCustomerModal}
        customer={customer}
        setCustomer={setCustomer}
        isFromHomePage={true}
        setOpenOfferModal={setOpenModal}
        userQuote={userQuote}
      />
      <GoMakeDialog
        open={compositeDialogOpen}
        onClose={handleCompositeCancel}
        title={t("products.addProduct.admin.compositeProductTitle")}
        primaryButtonLabel={t("products.offsetPrice.admin.addOrderBtn")}
        cancelButtonLabel={t("modal.cancel")}
        onPrimaryAction={handleCompositeConfirm}
        onCancel={handleCompositeCancel}
        maxWidth="md"
        customStyles={{
          primaryButton: {
            backgroundColor: secondColor(500),
          },
        }}
      >
        <div
          className={"custom-scrollbar"}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 500,
            marginTop: 8,
            maxHeight: "600px",
            overflowY: "auto",
            paddingRight: 8,
          }}>
          {isLoadingCompositeProducts ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Skeleton for Quantity and Job Name Fields */}
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <Skeleton variant="text" width={80} height={20} />
                  <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                </div>
              </div>

              {/* Skeleton for Product Cards */}
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  {/* Product Name Skeleton */}
                  <Skeleton variant="text" width={200} height={24} style={{ marginBottom: 8 }} />

                  {/* Quantity and Job Name Fields Skeleton */}
                  <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <Skeleton variant="text" width={70} height={20} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : compositeProducts.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center" }}>
              {t("products.addProduct.admin.noCompositeProducts")}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              {/* Quantity and Job Name Fields */}
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginBottom: 8
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {t("products.addProduct.admin.quantityLabel")}
                  </div>
                  <GomakeTextInput
                    value={quantityMultiplier.toString()}
                    placeholder={t("products.addProduct.admin.quantityPlaceholder")}
                    onChange={(event) => {
                      const value = event.target.value;
                      const numValue = value === "" ? 1 : Number(value);
                      handleMultiplierChange(numValue);
                    }}
                    type="number"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {t("products.addProduct.admin.jobNameLabel")}
                  </div>
                  <GomakeTextInput
                    value={mainJobName}
                    placeholder={t("products.addProduct.admin.jobNamePlaceholder")}
                    onChange={(event) => {
                      handleMainJobNameChange(event.target.value);
                    }}
                  />
                </div>
              </div>
              {compositeProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 16,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                    {product.name}
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>
                        {t("products.addProduct.admin.quantityLabel")}
                        <span style={{ color: "red", marginLeft: 4 }}>*</span>
                      </div>
                      <GomakeTextInput
                        value={product.quantity.toString()}
                        placeholder={t("products.addProduct.admin.quantityPlaceholder")}
                        onChange={(event) => {
                          const value = event.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          handleProductQuantityChange(index, numValue);
                        }}
                        type="number"
                        error={Boolean(compositeErrors[`${index}`]?.quantity)}
                        helperText={compositeErrors[`${index}`]?.quantity}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>
                        {t("products.addProduct.admin.jobNameLabel")}
                      </div>
                      <GomakeTextInput
                        value={product.jobName}
                        placeholder={t("products.addProduct.admin.jobNamePlaceholder")}
                        onChange={(event) => {
                          updateCompositeProduct(index, "jobName", event.target.value);
                        }}
                        error={Boolean(compositeErrors[`${index}`]?.jobName)}
                        helperText={compositeErrors[`${index}`]?.jobName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GoMakeDialog>
    </div>
  );
};

export { QuoteWidget };
