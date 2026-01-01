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
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";

const OrderNowPrePaymentModal = ({
  openModal,
  onClose,
  handleOrderConfirmation,
  quoteItemValue,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [percentage, setPercentage] = useState(100);
  const [totalAmount, setTotalAmount] = useState(
    quoteItemValue?.totalPayment || 0
  );
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);

  useEffect(() => {
    setTotalAmount(quoteItemValue?.totalPayment || 0);
  }, [quoteItemValue?.totalPayment]);

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
                {t("prePayment.percentageOfTotal")}
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
                placeholder={t("prePayment.percentageOfTotal")}
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
                {t("prePayment.totalToPay")}
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
                placeholder={t("prePayment.totalToPay")}
                value={totalAmount}
                onChange={handleTotalAmountChange}
              />
            </Stack>
          </Stack>

          <div style={classes.mainBtnContainer}>
            {!hasFrontDeskFeature ? <>
              <GomakePrimaryButton
                style={classes.btnStyle}
                onClick={() =>
                  handleOrderConfirmation(true, true, totalAmount, percentage, false, hasFrontDeskFeature)
                }
              >
                {t("sales.modals.withPaymentMessage")}
              </GomakePrimaryButton>
              <GomakePrimaryButton
                style={classes.secondBtn}
                onClick={() =>
                  handleOrderConfirmation(false, true, totalAmount, percentage, false, hasFrontDeskFeature)
                }
              >
                {t("sales.modals.withoutPaymentMessage")}
              </GomakePrimaryButton>
            </> : <>
              <GomakePrimaryButton
                style={classes.btnStyle}
                onClick={() =>
                  handleOrderConfirmation(true, true, totalAmount, percentage, false, hasFrontDeskFeature)
                }
              >
                {t("mailingSettings.Confirm")}
              </GomakePrimaryButton>
            </>}
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
        {/* <GoMakeLoadingBackdrop loading={loading} circular={false} /> */}
      </GoMakeModal>
    </>
  );
};
export { OrderNowPrePaymentModal };
