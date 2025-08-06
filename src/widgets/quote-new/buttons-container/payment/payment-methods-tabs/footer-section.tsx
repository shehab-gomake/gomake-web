import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "../style";
import { usePaymentsTable } from "@/widgets/quote-new/receipts-table/use-payments-table";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { useRecoilValue } from "recoil";
import { totalAllocatedDocumentsState } from "../../states";
import { fmt2, round2 } from "@/utils/helpers";

const FooterSection = ({ onCloseModal }: any) => {
  const { classes } = useStyle();
  const {
    t,
    // totalSum,
    totalPayment,
    handleSave,
    handleTaxDeductionChange,
    taxDeduction,
    secondWidget,
    thirdWidget,
    totalCreditCard,
    isTransacted,
    onClickMakePayment,
    transactionSelected,
    openTransactionModal,
    handleOpenTransactionModal,
    setOpenTransactionModal,
    resetTotalCreditCard,
    resetCreditCardState,
    setTotalPayment,
    validateRequiredAccountCodes,
  } = usePaymentsTable();

  const totalAllocatedDocuments = useRecoilValue<number>(
    totalAllocatedDocumentsState
  );

  const diff = round2(totalAllocatedDocuments - totalPayment);

  const handleClickCancelTransactionModal = () => {
    if (!validateRequiredAccountCodes()) return;

    handleSave(null, true);
    // reset credit card total and state
    // setTotalPayment(totalPayment - totalCreditCard);
    resetCreditCardState();
    resetTotalCreditCard();
    onCloseModal();
    setOpenTransactionModal(false);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const handleSaveAndClose = (transactionData) => {
    if (!validateRequiredAccountCodes()) return;

    handleSave(transactionData);
    onCloseModal();
  };

  const onClickSave = () => {
    if (
      !isTransacted &&
      totalCreditCard > 0 &&
      !secondWidget &&
      !transactionSelected
    ) {
      handleOpenTransactionModal();
    } else {
      if (!validateRequiredAccountCodes()) return;

      handleSave();
      onCloseModal();
    }
  };

  return (
    <div style={classes.divStyle}>
      <Stack
        style={{
          ...classes.saveBtn,
          flexDirection: "row",
          width: "50%",
          gap: "10px",
        }}
      >
        <span style={classes.taxLBLStyle}>{t("payment.taxDeduction")} :</span>
        <input
          style={classes.taxInputStyle}
          value={taxDeduction}
          onChange={handleTaxDeductionChange}
        />
      </Stack>
      <Stack
        width={"100%"}
        justifyContent={"space-between"}
        display={"flex"}
        height={"100%"}
      >
        <Stack sx={classes.containerStyle}>
          <Stack
            style={{
              ...classes.rowStyle,
              borderBottom: "2px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <span style={classes.textStyle}>{t("payment.totalDocuments")}</span>
            <input
              readOnly
              id={"totalFromDocuments"}
              style={classes.inputStyle}
              value={fmt2(totalAllocatedDocuments)}
            />
          </Stack>

          {diff > 0 && totalPayment !== 0 && (
            <Stack
              style={{
                ...classes.rowStyle,
                borderBottom: "2px solid rgba(0, 0, 0, 0.04)",
              }}
            >
              <span style={classes.textStyle}>{t("payment.balance")}</span>
              <input style={classes.inputStyle} value={fmt2(diff)} />
            </Stack>
          )}
          <Stack
            style={{
              ...classes.rowStyle,
              borderBottom: "2px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <span style={classes.textStyle}>{t("payment.totalPayment")}</span>
            <input style={classes.inputStyle} value={totalPayment} />
          </Stack>

          {diff < 0 && (
            <Stack
              style={{
                ...classes.rowStyle,
                borderBottom: "2px solid rgba(0, 0, 0, 0.04)",
              }}
            >
              <span style={classes.textStyle}>
                {t("payment.excessPayment")}
              </span>
              <input
                readOnly
                style={classes.inputStyle}
                value={fmt2(Math.abs(diff))}
              />
            </Stack>
          )}
        </Stack>
        <SecondaryButton
          variant={"contained"}
          style={classes.saveBtn}
          onClick={onClickSave}
        >
          {t("payment.save")}
        </SecondaryButton>
      </Stack>
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("payment.PendingCreditCardTransactionDetected")}
        subTitle={" "}
        yesBtn={t("payment.MakePayment")}
        openModal={openTransactionModal}
        onClose={handleCloseTransactionModal}
        onClickCancel={handleClickCancelTransactionModal}
        onClickDelete={() =>
          onClickMakePayment(handleSaveAndClose, thirdWidget)
        }
        cancelBtn={t("modal.cancel")}
      />
    </div>
  );
};

export { FooterSection };
