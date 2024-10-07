import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { TransferBalanceModal } from "../transfer-balance-modal";
import { useAdjustmentsModal } from "./use-adjustments-modal";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Skeleton } from "@mui/material";

const AdjustmentsLedgerReportModal = ({
  openModal,
  onCloseModal,
  clientPaymentsList,
  getClientPaymentItems,
  customerId,
  setClientPaymentsList
}) => {
  const { classes } = useStyle();
  const {
    getTableDataRows,
    calculateTotalPrice,
    onClickCloseDeleteModal,
    cancelTransactionsApi,
    onClickCloseTransferModal,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    transferBalanceApi,
    t,
    tableHeaders,
    btns,
    openDeleteModal,
    openTransferModal,
    customer,
  } = useAdjustmentsModal({
    clientPaymentsList,
    getClientPaymentItems,
    customerId,
  });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.adjustmentsLists")}
        onClose={() => {
          setClientPaymentsList([])
          onCloseModal()
        }}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          {clientPaymentsList?.length <= 0 ? (
            <>
              <Skeleton height={600} variant="rectangular" width="100%" style={{ borderRadius: 8 }} />
              <div style={classes.btnsContainer}>
                {[...Array(btns.length)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" width={"33%"} height={40} style={{ borderRadius: 8 }} />
                ))}
              </div>
            </>
          ) : (
            <>
              <PrimaryTable
                rows={getTableDataRows()}
                headers={tableHeaders}
                maxHeight={610}
                stickyHeader={true}
              />
              <div style={classes.totalPriceContainer}>
                {calculateTotalPrice().toFixed(3)} NIS
              </div>
              <div style={classes.btnsContainer}>
                {btns.map((tab, index) => (
                  <SecondaryButton
                    variant="contained"
                    key={index}
                    onClick={tab.onclick}
                    style={classes.btnContainer}
                  >
                    {tab.name}
                  </SecondaryButton>
                ))}
              </div>
            </>
          )}
        </div>
        <GoMakeDeleteModal
          openModal={openDeleteModal}
          onClose={onClickCloseDeleteModal}
          onClickDelete={cancelTransactionsApi}
        />
        <TransferBalanceModal
          onCloseModal={onClickCloseTransferModal}
          openModal={openTransferModal}
          customer={customer}
          renderOptions={renderOptions}
          checkWhatRenderArray={checkWhatRenderArray}
          handleCustomerChange={handleCustomerChange}
          transferBalanceApi={transferBalanceApi}
        />
      </GoMakeModal>
    </>
  );
};

export { AdjustmentsLedgerReportModal };
