import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { generalInputs, lastOrderInputs } from "../../inputs/general-inputs";
import { useStyle } from "../../style";

interface IProps {
    codeFlag: any;
    onChangeInputs: (key: any, value: any) => void;
    customer: any;
    setCustomer: any;
    typeClient: any;
    renderTabPanelTextArea: any;
    languagesOptions: any;
    renderTableSearch: any;
}

const GeneralTab = ({ codeFlag, customer, setCustomer, onChangeInputs, typeClient, renderTabPanelTextArea, languagesOptions, renderTableSearch }: IProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation()

    return (
        <div style={classes.tabsContainer}>
            <div style={classes.customerInfoStyle}>
                {generalInputs(typeClient, customer, languagesOptions).map((item) => (
                    <div style={{ marginBottom: 10 }}>
                        <FormInput
                            key={"general-input"}
                            input={item as IInput}
                            changeState={onChangeInputs}
                            error={false}
                            readonly={false}
                        />
                    </div>
                ))}
            </div>
            <div>
                <Stack
                    direction={"row"}
                    marginTop={"8px"}
                    marginBottom={"8px"}
                    gap="20px"
                >
                    {renderTabPanelTextArea(
                        t("customers.modal.generalComment"),
                        customer?.generalNotes,
                        (e) => setCustomer({ ...customer, generalNotes: e.target.value })
                    )}
                    {renderTabPanelTextArea(
                        t("customers.modal.orderOpeningNotes"),
                        customer?.newItemNotes,
                        (e) => setCustomer({ ...customer, newItemNotes: e.target.value })
                    )}
                    {renderTabPanelTextArea(
                        t("customers.modal.orderClosingNotes"),
                        customer?.closeOrderNotes,
                        (e) =>
                            setCustomer({ ...customer, closeOrderNotes: e.target.value })
                    )}
                </Stack>
                {codeFlag && (
                    <>
                        <Stack direction={"row"}>
                            <span style={classes.lastOrderDetails} >
                                {t("customers.modal.lastOrderDetails")}
                            </span>
                        </Stack>
                        <div style={classes.customerInfoStyle}>
                            {lastOrderInputs(customer).map((item) => (
                                <div style={{ marginBottom: 10 }}>
                                    <FormInput
                                        key={"last-order-details-input"}
                                        input={item as IInput}
                                        changeState={onChangeInputs}
                                        error={false}
                                        readonly={!!item.readonly}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {renderTableSearch}
        </div>
    );
};

export { GeneralTab };
