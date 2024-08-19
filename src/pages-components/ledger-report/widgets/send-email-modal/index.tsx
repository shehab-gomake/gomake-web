import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";


const SendEmailLedgerReportModal = ({ openModal, onCloseModal, clientContactsValue, setSelectedContactById, selectedContactById, onChangeUpdateClientContact, SendCustomerLedgerToMailApi }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.chooseEmailToSendCard")}
        onClose={onCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <Divider style={classes.dividerContainer} />
          <div style={classes.inputsContainer}>
            <div style={classes.itemInputContainer}>
              <h3>{t("reports.contact")}</h3>
              <div style={{ width: "100%" }}>
                <GoMakeAutoComplate
                  options={clientContactsValue}
                  style={classes.autoComplateStyle}
                  placeholder={t("sales.quote.contactID")}
                  getOptionLabel={(item) => item?.name}
                  onChange={(e: any, item: any) => {
                    setSelectedContactById(item);
                  }}
                />
              </div>
            </div>
            <div style={classes.itemInputContainer}>
              <h3>{t("sales.quote.email")}</h3>
              <div style={{ width: "100%" }}>
                <GomakeTextInput
                  placeholder={t("sales.quote.email")}
                  style={classes.textInputStyle}
                  value={selectedContactById?.mail}
                  onChange={(e: any) => {
                    onChangeUpdateClientContact(
                      "mail",
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <SecondaryButton variant="contained" onClick={SendCustomerLedgerToMailApi}>{t("login.send")}</SecondaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { SendEmailLedgerReportModal };