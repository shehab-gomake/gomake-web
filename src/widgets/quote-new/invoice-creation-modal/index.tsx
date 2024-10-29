import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { useStyle } from "./style";
import { FONT_FAMILY } from "@/utils/font-family";
import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CreateIcon, PayIcon, PrinterIcon } from "./components/icons";
import { CircleCheckbox } from "@/components/check-box/circle-check-box";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { getDocumentPdfApi } from "@/services/api-service/generic-doc/documents-api";
import { useState } from "react";

enum MessageTypes {
  EMAIL = "email",
  PHONE = "phone",
}

interface InvoiceCreationModal {
  openModal: boolean;
  onClose: () => void;
  docType: any;
  onClickSendDocumentToClient: (value) => void;
}

const InvoiceCreationModal = ({
  openModal,
  onClose,
  docType,
  onClickSendDocumentToClient,
}: InvoiceCreationModal) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const { navigate } = useGomakeRouter();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const documentPath = DOCUMENT_TYPE[docType];

  const onClickPrint = async () => {
    const downloadPdf = (url) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.addEventListener("click", () => {
        setTimeout(() => {
          anchor.remove();
        }, 100);
      });
      anchor.click();
    };
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
      } else {
        alertFaultGetData();
      }
    };
    await getDocumentPdfApi(callApi, callBack, {
      documentId: quoteItemValue?.id,
      documentType: docType,
    });
  };

  const [selectedOption, setSelectedOption] = useState<MessageTypes | null>(
    MessageTypes.EMAIL
  );

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.modals.proceedToCreateInvoice")}
        onClose={onClose}
        modalTitleStyle={{ ...FONT_FAMILY.Inter(600, 18) }}
        modalTitleColor={"#000000"}
        withRoundedCloseIcon={false}
        insideStyle={classes.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* First Section */}
          <Stack direction={"column"} gap={"10px"} width={"100%"}>
            <span style={classes.sectionTitle}>
              {t("sales.modals.sendInvoice")}
            </span>
            <Stack direction={"row"} gap={"10px"} width={"100%"}>
              <Stack direction={"row"} width={"100%"} alignItems={"center"}>
                <CircleCheckbox
                  checked={selectedOption === MessageTypes.EMAIL}
                  onChange={() => setSelectedOption(MessageTypes.EMAIL)}
                />

                <span
                  style={{
                    ...classes.sectionTitle,
                    ...FONT_FAMILY.Inter(400, 12),
                  }}
                >
                  {t("sales.modals.email")}
                </span>
              </Stack>
              <Stack direction={"row"} width={"100%"} alignItems={"center"}>
                <CircleCheckbox
                  checked={selectedOption === MessageTypes.PHONE}
                  onChange={() => setSelectedOption(MessageTypes.PHONE)}
                />
                <span
                  style={{
                    ...classes.sectionTitle,
                    ...FONT_FAMILY.Inter(400, 12),
                  }}
                >
                  {t("sales.modals.phoneNumber")}
                </span>
              </Stack>
            </Stack>
            <GomakeTextInput
              sx={{
                minWidth: 180,
                borderRadius: "8px",
                border: "1px solid #D0D5DD",
                "& .MuiOutlinedInput-root": {
                  "& input": {
                    height: "40px",
                  },
                },
              }}
              placeholder={t("Write your email here...")}
            />
            <GomakePrimaryButton
              style={{
                width: "100%",
                borderRadius: "8px",
                height: "40px",
              }}
              onClick={() =>
                selectedOption === MessageTypes.EMAIL
                  ? onClickSendDocumentToClient(0)
                  : onClickSendDocumentToClient(1)
              }
            >
              {t("sales.modals.send")}
            </GomakePrimaryButton>
          </Stack>

          {/* Second Section */}
          <Stack direction={"column"} gap={"10px"} width={"100%"}>
            <span style={classes.sectionTitle}>
              {t("sales.modals.otherOptions")}
            </span>
            <Button
              style={classes.optionsButtons}
              onClick={onClickPrint}
              startIcon={<PrinterIcon />}
            >
              {t("sales.modals.print")}
            </Button>
            <Button
              style={classes.optionsButtons}
              startIcon={<PayIcon />}
              onClick={() =>
                navigate(
                  `/receipt?isNewCreation=true&documentNumber=${quoteItemValue?.number}&ClientId=${quoteItemValue?.customerID}`
                )
              }
            >
              {t("sales.modals.pay")}
            </Button>
            <Button
              style={classes.optionsButtons}
              startIcon={<CreateIcon />}
              onClick={() => {
                navigate(`/${documentPath}?isNewCreation=true`);
                onClose();
              }}
            >
              {t("sales.modals.createNewInvoice")}
            </Button>
          </Stack>
        </div>
      </GoMakeModal>
    </>
  );
};
export { InvoiceCreationModal };
