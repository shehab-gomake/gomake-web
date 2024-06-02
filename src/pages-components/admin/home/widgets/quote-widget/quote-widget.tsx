import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
} from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useStyle } from "./style";
import { Popover } from "@mui/material";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useEffect } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote-new/store/quote";
import Stack from "@mui/material/Stack";
import { selectedClientState } from "@/pages-components/quotes/states";
import { useTour } from "@reactour/tour";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { isValidCustomer } from "@/utils/helpers";
import { CUSTOMER_ACTIONS } from "@/pages/customers/enums";

const QuoteWidget = ({ isAdmin = true }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const resetSelectedClient = useResetRecoilState(selectedClientState);

  const {
    clientTypesValue,
    productValue,
    id,
    anchorEl,
    isDisabled,
    handleClick,
    onClickCreateQuote,
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
    setSelectedProduct,
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
    getAllClientTypes
  } = useQuoteWidget(DOCUMENT_TYPE.quote);

  useEffect(() => {
    if (userQuote) {
      setQuoteId(userQuote.id);
      setQuoteNumber(userQuote.number);
      setQuoteIfExist(true);
      setSelectedClient(userQuote.client);
      const clientType = clientTypesValue.find(
        (c) => c.id == userQuote.client.clientTypeId
      );
      setSelectedClientType(clientType);
    } else {
      // resetSelectedClient();
      setQuoteId(null);
      setQuoteNumber(null);
      setQuoteIfExist(false);
    }
  }, [userQuote]);

  useEffect(() => {
    const fetchData = async () => {
      await getAllClientTypes();
      getAndSetExistQuote();
    };
    fetchData();
  }, []);

  return (
    <div data-tour="quote-widget" style={classes.mainContainer}>
      <div style={classes.customerSectionStyle}>
        <div style={classes.autoComplateRowContainer}>
          <div data-tour="select-customer" style={{ width: "65%" }}>
            <GoMakeAutoComplate
              options={renderOptions() ? renderOptions() : []}
              placeholder={t("home.admin.selectCustomer")}
              style={classes.selectCustomerContainer}
              getOptionLabel={(option: any) =>
                option && option.name ? `${option.name}-${option.code}` : ""
              }
              onChangeTextField={checkWhatRenderArray}
              value={selectedClient}
              onChange={(e: any, value: any) => {
                handleClickToSelectedCustomer(
                  userQuote?.client?.id,
                  value
                ).then();
              }}
            />
          </div>
          <div data-tour="select-type" style={{ width: "30%" }}>
            <GoMakeAutoComplate
              options={clientTypesValue}
              placeholder={t("home.admin.selectType")}
              style={classes.selectTypeContainer}
              getOptionLabel={(option: any) => (option?.name ? option.name : "")}
              onChange={(e: any, value: any) => {
                setSelectedClientType(value);
              }}
              value={selectedClientType}
            />
          </div>
        </div>
        <button style={classes.autoButtonStyle} onClick={onClickAddCustomer} >{t("customers.buttons.AddOrSearch")}</button>
      </div>
      <div style={classes.autoComplateRowContainer}>
        <div data-tour="select-product" style={{ width: "65%" }}>
          <GoMakeAutoComplate
            options={productValue}
            placeholder={t("home.admin.selectProduct")}
            style={classes.selectTypeContainer}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, value: any) => {
              setSelectedProduct(value);
            }}
          />
        </div>
      </div>
      {userQuote ? (
        <Stack direction={"row"} gap={"13px"} width={"100%"}>
          <div style={classes.btnContainer}>
            <PermissionCheck userPermission={Permissions.CREATE_QUOTES}>
              <GomakePrimaryButton
                onClick={
                  isDisabled
                    ? handleClick
                    : isAdmin
                      ? onClickCreateQuote
                      : onClickCreateQuoteForCustomer
                }
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
              isDisabled
                ? handleClick
                : isAdmin
                  ? onClickCreateQuote
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
        subTitle={t("sales.quote.MessageForClient")}
        icon={ <WarningAmberIcon style={classes.AmberIconStyle} />}
        title={t("sales.quote.titleMessage")}
        yesBtn={t("sales.quote.Confirm")}
        openModal={openModal}
        onClose={onClickCloseModal}
        onClickDelete={() =>onClickSaveQuote(QuoteId)}
        onClickCancel={handleCancel}
      />
      <CustomerCardWidget
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Add}
        codeFlag={false}
        typeClient={"C"}
        onCustomerAdd={onCustomerAdd}
        openModal={openCustomerModal}
        modalTitle={t("customers.modal.addTitle")}
        onClose={onCloseCustomerModal}
        showAddButton={true}
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