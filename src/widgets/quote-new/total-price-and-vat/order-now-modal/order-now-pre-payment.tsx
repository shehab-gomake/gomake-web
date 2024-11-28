import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { OrderNowIcon } from "./icons";
import { Stack } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useState } from "react";

//!here
const OrderNowPrePaymentModal = ({
  openModal,
  onClose,
  confirmWithoutNotification,
  confirmWithNotification,
  quoteItemValue,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [percentage, setPercentage] = useState(100);
  const [totalAmount, setTotalAmount] = useState(
    quoteItemValue?.totalPayment || 0
  );

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = Number(e.target.value);
    setPercentage(newPercentage);

    const calculatedAmount =
      (newPercentage / 100) * (quoteItemValue?.totalPayment || 0);
    setTotalAmount(calculatedAmount);
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotalAmount = Number(e.target.value);
    setTotalAmount(newTotalAmount);

    const calculatedPercentage =
      (newTotalAmount / (quoteItemValue?.totalPayment || 1)) * 100;
    setPercentage(calculatedPercentage);
  };

  const handleCloseModal = () => {
    onClose();
    setPercentage(100);
    setTotalAmount(quoteItemValue?.totalPayment || 0);
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        onClose={handleCloseModal}
        insideStyle={classes.insideStyleNew}
        headerStyle={classes.headerStyle}
        withClose={false}
        withRoundedCloseIcon={false}
      >
        <div style={classes.mainContainer}>
          <OrderNowIcon />
          <Stack alignItems={"center"} gap={"5px"}>
            <span style={classes.titleContainer}>
              {t("sales.quote.orderNowTitle")}
            </span>
            <span
              style={classes.subTitleContainer}
              dangerouslySetInnerHTML={{
                __html: t("sales.quote.warningPrePaymentMsg"),
              }}
            >
              {/* {t("sales.quote.warningPrePaymentMsg")} */}
            </span>
          </Stack>
          <Stack direction={"column"} gap={"10px"} marginBottom={4}>
            <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
              <span
                style={{
                  ...FONT_FAMILY.Inter(500, 14),
                  color: "#344054",
                  minWidth: "fit-content",
                }}
              >
                {t("Percentage of total")}
              </span>
              <GomakeTextInput
                type={"number"}
                sx={{
                  minWidth: 150,
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "40px",
                    },
                  },
                }}
                placeholder={t("Percentage of total")}
                value={percentage}
                onChange={handlePercentageChange}
              />
            </Stack>
            <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
              <span
                style={{
                  ...FONT_FAMILY.Inter(500, 14),
                  color: "#344054",
                  minWidth: "fit-content",
                }}
              >
                {t("Total amount to pay")}
              </span>
              <GomakeTextInput
                type={"number"}
                sx={{
                  minWidth: 180,
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      height: "40px",
                    },
                  },
                }}
                placeholder={t("Total amount to pay")}
                value={totalAmount}
                onChange={handleTotalAmountChange}
              />
            </Stack>
          </Stack>

          <div style={classes.mainBtnContainer}>
            <GomakePrimaryButton
              style={classes.btnStyle}
              onClick={confirmWithNotification}
            >
              {t("Confirm with payment message")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.secondBtn}
              onClick={confirmWithoutNotification}
            >
              {t("Confirm without payment message")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={{
                borderRadius: "8px",
                height: "40px",
                background: "white",
                color: "#000000",
                border: "1px solid  #D0D5DD",
              }}
              onClick={handleCloseModal}
            >
              {t("sales.quote.discard")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { OrderNowPrePaymentModal };
