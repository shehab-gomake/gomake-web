import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate, GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useQuoteWidget } from "./use-quote-widget";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useStyle } from "./style";
import { Popover } from "@mui/material";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useEffect, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useRecoilState } from "recoil";
import { QuoteIfExistState, QuoteNumberState } from "@/pages-components/quote/store/quote";
import Stack from "@mui/material/Stack";

const QuoteWidget = ({ isAdmin = true }) => {
    const { clasess } = useStyle();
    const [QuoteId, setQuoteId] = useState("");
    const [quoteNumber, setquoteNumber] = useRecoilState<any>(QuoteNumberState);
    const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);

    const { t } = useTranslation();
    const {
        clientTypesValue,
        productValue,
        id,
        anchorEl,
        isDisabled, handleClick, onClcikCreateQuote, onClcikCreateQuoteForCustomer,
        open,
        openModal,
        onClickSaveQuote,
        userQuote,
        updateCustomerList,
        errorColor,
        selectedClientType,
        selectedClient,
        onClcikCloseModal,
        _renderErrorMessage,
        handleClose,
        updateQuoteExist,
        setSelectedClientType,
        setSelectedClient,
        setSelectedProduct,
        updateCustomerListSelectedAfterConfirm,
        checkWhatRenderArray,
        handleClicktoSelectedCustomer,
        renderOptions,
    } = useQuoteWidget();

    useEffect(() => {

        if (userQuote) {
            setQuoteId(userQuote.id);
            setquoteNumber(userQuote.number)
            setQuoteIfExist(true);
            setSelectedClient(userQuote.client);
            const clientType = clientTypesValue.find((c) => c.id == userQuote.client.clientTypeId);
            setSelectedClientType(clientType)
        } else {
            setQuoteId(null);
            setquoteNumber(null)
            setQuoteIfExist(false);
            //setSelectedClient(null)
        }

    }, [userQuote])
    return (

        <div style={clasess.mainContainer}>
            <div style={clasess.autoComplateRowContainer}>
                <div style={{ width: "65%" }}>
                    <GoMakeAutoComplate
                        options={renderOptions() ? renderOptions() : []}
                        placeholder={t("home.admin.selectCustomer")}
                        style={clasess.selectCustomerContainer}
                        getOptionLabel={(option: any) => option && option.name ? `${option.name}-${option.code}` : ''}
                        onChangeTextField={checkWhatRenderArray}
                        value={selectedClient}
                        onChange={(e: any, value: any) => {
                            handleClicktoSelectedCustomer(userQuote?.client?.id, value).then();
                        }}
                    />
                </div>
                <div style={{ width: "30%" }}>
                    <GoMakeAutoComplate
                        options={clientTypesValue}
                        placeholder={t("home.admin.selectType")}
                        style={clasess.selectTypeContainer}
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
            <div style={clasess.autoComplateRowContainer}>
                <div style={{ width: "65%" }}>
                    <GoMakeAutoComplate
                        options={productValue}
                        placeholder={t("home.admin.selectProduct")}
                        style={clasess.selectTypeContainer}
                        getOptionLabel={(option: any) => option.name}
                        onChange={(e: any, value: any) => {
                            setSelectedProduct(value);
                        }}
                    />
                </div>
            </div>

            {
                userQuote ?
                    <Stack direction={'row'} gap={'13px'} width={'100%'}>
                        <div style={clasess.btnContainer}>
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
                                    onClickSaveQuote(QuoteId).then(() => setSelectedClient(null)).then(() => setSelectedClientType(null))

                                }}
                            >
                                {t("home.admin.SaveQuote")}
                            </SecondaryButton>
                        </div>

                    </Stack>
                    : <div style={{ width: "50%" }}>
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

            }

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
                <div style={clasess.errorMsgStyle}>{_renderErrorMessage()}</div>
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
                    onClcikCloseModal().then()
                }}
                subTitle={t("sales.quote.MessageForClient")}
                onClickDelete={() => {
                    onClickSaveQuote(QuoteId)
                        .then(() => onClcikCloseModal())

                }}
            />
        </div>

    );
};

export { QuoteWidget };
