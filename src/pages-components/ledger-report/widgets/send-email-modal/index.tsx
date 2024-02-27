import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { Divider } from "@mui/material";


const SendEmailLedgerReportModal = ({ openModal, onCloseModal, clientContactsValue, setSelectedContactById, selectedContactById, onChangeUpdateClientContact }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Choose an Email To Send Card"
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <Divider style={clasess.dividerContainer} />
          <div style={clasess.inputsContainer}>
            <div style={clasess.itemInputContainer}>
              <h3>Content</h3>
              <div style={{ width: "100%" }}>
                <GoMakeAutoComplate
                  options={clientContactsValue}
                  style={clasess.autoComplateStyle}
                  placeholder={t("sales.quote.contactID")}
                  getOptionLabel={(item) => item?.name}
                  onChange={(e: any, item: any) => {
                    setSelectedContactById(item);
                  }}
                />
              </div>
            </div>
            <div style={clasess.itemInputContainer}>
              <h3>Mail</h3>
              <div style={{ width: "100%" }}>
                <GomakeTextInput
                  placeholder={t("sales.quote.email")}
                  style={clasess.textInputStyle}
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
        </div>
      </GoMakeModal>
    </>
  );
};

export { SendEmailLedgerReportModal };