import { useTranslation } from "react-i18next";
import { Divider, Typography } from "@mui/material";
import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

import { getLabelTypography } from "@/utils/typography-utils";

const SendEmailLedgerReportModal = ({
  openModal,
  onCloseModal,
  clientContactsValue,
  setSelectedContactById,
  selectedContactById,
  onChangeUpdateClientContact,
  SendCustomerLedgerToMailApi,
  isAgingReport,
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={
          isAgingReport
            ? t("sales.quote.sendPayment")
            : t("reports.chooseEmailToSendCard")
        }
        onClose={onCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <Divider style={classes.dividerContainer} />
          <div style={classes.inputsContainer}>
            <div style={classes.itemInputContainer}>
              <Typography style={getLabelTypography()}>
                {t("reports.contact")}
              </Typography>
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
              <Typography style={getLabelTypography()}>
                {t("sales.quote.email")}
              </Typography>
              <div style={{ width: "100%" }}>
                <GomakeTextInput
                  placeholder={t("sales.quote.email")}
                  style={classes.textInputStyle}
                  value={selectedContactById?.mail}
                  onChange={(e: any) => {
                    onChangeUpdateClientContact("mail", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <SecondaryButton
            variant="contained"
            onClick={SendCustomerLedgerToMailApi}
          >
            {t("login.send")}
          </SecondaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};

export { SendEmailLedgerReportModal };
