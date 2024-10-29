import { GomakePrimaryButton } from "@/components";
import { FONT_FAMILY } from "@/utils/font-family";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { CircleCheckbox } from "@/components/check-box/circle-check-box";
import { useState } from "react";

enum MessageTypes {
  EMAIL = "email",
  PHONE = "phone",
}

interface SendInvoiceSectionProps {
  handleSendDocument: (value) => void;
}

const SendInvoiceSection: React.FC<SendInvoiceSectionProps> = ({
  handleSendDocument,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [selectedOption, setSelectedOption] = useState<MessageTypes | null>(
    MessageTypes.EMAIL
  );

  return (
    <Stack direction={"column"} gap={"10px"} width={"100%"}>
      <span style={classes.sectionTitle}>{t("sales.modals.sendInvoice")}</span>
      <Stack direction={"row"} gap={"10px"} width={"100%"}>
        <Stack direction={"row"} width={"100%"} alignItems={"center"}>
          <CircleCheckbox
            checked={selectedOption === MessageTypes.EMAIL}
            onChange={() => setSelectedOption(MessageTypes.EMAIL)}
          />
          <span
            style={{
              ...classes.sectionTitle,
              ...FONT_FAMILY.Inter(500, 15),
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
              ...FONT_FAMILY.Inter(500, 14),
            }}
          >
            {t("sales.modals.phoneNumber")}
          </span>
        </Stack>
      </Stack>
      <GomakePrimaryButton
        style={{
          width: "100%",
          borderRadius: "8px",
          height: "40px",
        }}
        onClick={() =>
          selectedOption === MessageTypes.EMAIL
            ? handleSendDocument(0)
            : handleSendDocument(1)
        }
      >
        {t("sales.modals.send")}
      </GomakePrimaryButton>
    </Stack>
  );
};

export { SendInvoiceSection };
