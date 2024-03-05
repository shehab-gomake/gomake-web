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
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote/store/quote";
import Stack from "@mui/material/Stack";
import { selectedClientState } from "@/pages-components/quotes/states";

const QuoteWidget = ({ isAdmin = true }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [QuoteId, setQuoteId] = useState("");
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
    onClcikCreateQuote,
    onClcikCreateQuoteForCustomer,
    open,
    openModal,
    onClickSaveQuote,
    userQuote,
    errorColor,
    selectedClientType,
    selectedClient,
    onClickCloseModal,
    _renderErrorMessage,
    handleClose,
    setSelectedClientType,
    setSelectedClient,
    setSelectedProduct,
    checkWhatRenderArray,
    handleClicktoSelectedCustomer,
    renderOptions,
  } = useQuoteWidget({});

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
      resetSelectedClient();
      setQuoteId(null);
      setQuoteNumber(null);
      setQuoteIfExist(false);
    }
  }, [userQuote, clientTypesValue]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.autoComplateRowContainer}>
        <div style={{ width: "65%" }}>
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
              handleClicktoSelectedCustomer(
                userQuote?.client?.id,
                value
              ).then();
            }}
          />
        </div>
        <div style={{ width: "30%" }}>
          <GoMakeAutoComplate
            options={clientTypesValue}
            placeholder={t("home.admin.selectType")}
            style={classes.selectTypeContainer}
            getOptionLabel={(option: any) => (option?.name ? option.name : "")}
            onChange={(e: any, value: any) => {
              setSelectedClientType(value);
            }}
            value={
              typeof selectedClientType != "undefined"
                ? selectedClientType
                : null
            }
          />
        </div>
      </div>
      <div style={classes.autoComplateRowContainer}>
        <div style={{ width: "65%" }}>
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
                      ? onClcikCreateQuote
                      : onClcikCreateQuoteForCustomer
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
        <div style={{ width: "50%" }}>
          <GomakePrimaryButton
            onClick={
              isDisabled
                ? handleClick
                : isAdmin
                  ? onClcikCreateQuote
                  : onClcikCreateQuoteForCustomer
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
        icon={
          <WarningAmberIcon
            style={{ width: 120, height: 120, color: errorColor(300) }}
          />
        }
        title={t("sales.quote.titleMessage")}
        yesBtn={t("sales.quote.Confirm")}
        openModal={openModal}
        onClose={() => {
          onClickCloseModal().then();
        }}
        subTitle={t("sales.quote.MessageForClient")}
        onClickDelete={() => {
          onClickSaveQuote(QuoteId).then(() => onClickCloseModal());
        }}
      />
    </div>
  );
};

export { QuoteWidget };
