import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeDialog,
  GomakeTextInput,
} from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import { useStyle } from "./style";
import { Popover } from "@mui/material";
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
  } = useQuoteWidget();

  const [compositeDialogOpen, setCompositeDialogOpen] = useState(false);
  const [compositeWorkName, setCompositeWorkName] = useState<string>("");
  const [compositeQuantity, setCompositeQuantity] = useState<string>("");
  const [compositeErrors, setCompositeErrors] = useState<{
    workName?: string;
    quantity?: string;
  }>({});

  const isCompositeSelectedProduct =
    selectedProduct?.category === ProductCategoryType.PRODUCT &&
    selectedProduct?.productStructureType === EProductStructureType.COMPOSITE;

  const openCompositeDialog = () => {
    setCompositeWorkName(selectedProduct?.name ?? "");
    setCompositeQuantity("");
    setCompositeErrors({});
    setCompositeDialogOpen(true);
  };

  const handleCompositeCancel = () => {
    setCompositeDialogOpen(false);
    setCompositeErrors({});
  };

  const handleCompositeConfirm = () => {
    const errors: { workName?: string; quantity?: string } = {};
    const trimmedWorkName = compositeWorkName.trim();
    if (!trimmedWorkName) {
      errors.workName = t("home.admin.workNameRequired");
    }
    const parsedQuantity = Number(compositeQuantity);
    if (!compositeQuantity) {
      errors.quantity = t("home.admin.quantityRequired");
    } else if (Number.isNaN(parsedQuantity)) {
      errors.quantity = t("home.admin.quantityRequired");
    } else if (parsedQuantity <= 0) {
      errors.quantity = t("home.admin.quantityPositive");
    }

    if (Object.keys(errors).length > 0) {
      setCompositeErrors(errors);
      return;
    }

    setCompositeDialogOpen(false);
    setCompositeErrors({});
    onClickCreateQuoteForCustomer({
      workName: trimmedWorkName,
      quantity: parsedQuantity,
    });
    setCompositeWorkName("");
    setCompositeQuantity("");
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
        title={t("home.admin.compositeProductTitle")}
        primaryButtonLabel={t("home.admin.continue")}
        cancelButtonLabel={t("modal.close")}
        onPrimaryAction={handleCompositeConfirm}
        onCancel={handleCompositeCancel}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontWeight: 500 }}>
              {t("home.admin.jobNameLabel")}
            </div>
            <GomakeTextInput
              value={compositeWorkName}
              placeholder={t("home.admin.enterJobName")}
              onChange={(event) => {
                setCompositeWorkName(event.target.value);
                if (compositeErrors.workName) {
                  setCompositeErrors((prev) => ({ ...prev, workName: undefined }));
                }
              }}
              error={Boolean(compositeErrors.workName)}
              helperText={compositeErrors.workName}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontWeight: 500 }}>
              {t("home.admin.quantityLabel")}
            </div>
            <GomakeTextInput
              value={compositeQuantity}
              placeholder={t("home.admin.enterQuantity")}
              onChange={(event) => {
                setCompositeQuantity(event.target.value);
                if (compositeErrors.quantity) {
                  setCompositeErrors((prev) => ({ ...prev, quantity: undefined }));
                }
              }}
              type="number"
              error={Boolean(compositeErrors.quantity)}
              helperText={compositeErrors.quantity}
            />
          </div>
        </div>
      </GoMakeDialog>
    </div>
  );
};

export { QuoteWidget };
