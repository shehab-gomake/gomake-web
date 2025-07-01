import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { generalInputs, lastOrderInputs } from "../../inputs/general-inputs";
import { useStyle } from "../../style";
import { useEffect, useRef } from "react";
import { CUSTOMER_ACTIONS } from "@/pages/customers/enums";

interface IProps {
  codeFlag: any;
  onChangeInputs: (key: any, value: any) => void;
  customer: any;
  setCustomer: any;
  typeClient: any;
  renderTabPanelTextArea: any;
  languagesOptions: any;
  renderTableSearch: any;
  showTable?: boolean;
  profileState?: any;
  customerAction: CUSTOMER_ACTIONS;
  ShipmentTypesList: { text: string; value: string }[];
}

const GeneralTab = ({
  codeFlag,
  customer,
  setCustomer,
  onChangeInputs,
  typeClient,
  renderTabPanelTextArea,
  languagesOptions,
  renderTableSearch,
  showTable,
  profileState,
  customerAction,
  ShipmentTypesList,
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current && showTable) {
      const divElement = divRef.current;
      const lastChild = divElement.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [showTable]);

  useEffect(() => {
    if (!customer?.clientLang && profileState?.systemLang) {
      setCustomer((prev) => ({
        ...prev,
        clientLang: profileState.systemLang,
      }));
    }
  }, [customer?.clientLang, profileState?.systemLang]);

  useEffect(() => {
    if (customerAction === CUSTOMER_ACTIONS.Add) {
      setCustomer((prev) => ({
        ...prev,
        isActive: true,
      }));
    }
  }, [customerAction]);

  return (
    <div style={classes.tabsContainer} ref={divRef}>
      <div style={classes.customerInfoStyle}>
        {generalInputs(
          typeClient,
          customer,
          languagesOptions,
          t,
          ShipmentTypesList
        ).map((item) => (
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
            (e) => setCustomer({ ...customer, closeOrderNotes: e.target.value })
          )}
        </Stack>
        {codeFlag && (
          <>
            <Stack direction={"row"}>
              <span style={classes.lastOrderDetails}>
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
