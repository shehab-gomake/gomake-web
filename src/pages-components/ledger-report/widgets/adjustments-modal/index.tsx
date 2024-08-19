
import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { TransferBalanceModal } from "../transfer-balance-modal";
import { useAdjustmentsModal } from "./use-adjustments-modal";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

const AdjustmentsLedgerReportModal = ({ openModal, onCloseModal, clientPaymentsList, getClientPaymentItems }) => {
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
  } = useAdjustmentsModal({ clientPaymentsList, getClientPaymentItems })

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.adjustmentsLists")}
        onClose={onCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <PrimaryTable
            rows={getTableDataRows()}
            headers={tableHeaders}
            maxHeight={610}
          />
          <div style={classes.totalPriceContainer}>{calculateTotalPrice().toFixed(2)} NIS</div>
          <div style={classes.btnsContainer}>
            {btns.map((tab, index) => {
              return (
                <SecondaryButton variant="contained" key={index} onClick={tab.onclick} style={classes.btnContainer}>{tab.name}</SecondaryButton>
              )
            })}
          </div>
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