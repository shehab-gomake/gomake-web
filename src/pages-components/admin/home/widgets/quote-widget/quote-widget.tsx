import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
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
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useClientTypesList } from "@/hooks/use-client-types";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import { ModalType } from "@/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

const QuoteWidget = ({ isMobileScreen = false }) => {
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

  useEffect(() => {
    if (userQuote) {
      setQuoteId(userQuote.id);
      setQuoteNumber(userQuote.number);
      setQuoteIfExist(true);
      setSelectedClient(userQuote.client);
      const clientType = clientTypesValue.find(
        (c) => c.id == userQuote?.client?.clientTypeId
      );
      setSelectedClientType(clientType);
    } else {
      setQuoteId(null);
      setQuoteNumber(null);
      setQuoteIfExist(false);
    }
  }, [userQuote]);

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

  return (
    <div data-tour="quote-widget" style={classes.mainContainer}>
      <PermissionCheck
        userPermission={Permissions.CAN_SELECT_CLIENT_IN_HOME_PAGE}
      >
        <div style={classes.customerSectionStyle}>
          <div style={classes.autoComplateRowContainer}>
            <div data-tour="select-customer" style={{ width: "65%" }}>
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
            <div data-tour="select-type" style={{ width: "30%" }}>
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
        <div
          data-tour="select-product"
          style={{ width: isMobileScreen ? "100%" : "65%" }}
        >
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
              <GomakePrimaryButton
                // onClick={
                //   isDisabled ? handleClick : onClickCreateQuoteForCustomer
                // }

                onClick={onClickCreateQuoteForCustomer}
                variant="contained"
                style={{ width: "100%", height: 40 }}
              >
                {t("home.admin.AddItemToQuote")}
              </GomakePrimaryButton>
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
        <div data-tour="create-quote" style={{ width: "50%" }}>
          <GomakePrimaryButton
            onClick={
              !selectedProduct?.id
                ? onclickCreateNew
                : onClickCreateQuoteForCustomer
            }
            variant="contained"
            style={{ width: "100%", height: 40 }}
          >
            {t("home.admin.createQoute")}
          </GomakePrimaryButton>
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
    </div>
  );
};

export { QuoteWidget };
