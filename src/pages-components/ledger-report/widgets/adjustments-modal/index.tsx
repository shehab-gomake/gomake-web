
import { GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";

import { TransferBalanceModal } from "../transfer-balance-modal";
import { useadJustmentsModal } from "./use-adjustments-modal";

import { useStyle } from "./style";

const AdjustmentsLedgerReportModal = ({ openModal, onCloseModal, clientPaymentsList, getClientPaymentItems }) => {
  const { clasess } = useStyle();
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
  } = useadJustmentsModal({ clientPaymentsList, getClientPaymentItems })

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("reports.adjustmentsLists")}
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <PrimaryTable
            rows={getTableDataRows()}
            headers={tableHeaders}
            maxHeight={610}
          />
          <div style={clasess.totalPriceContainer}>{calculateTotalPrice().toFixed(2)} NIS</div>
          <div style={clasess.btnsContainer}>
            {btns.map((tab, index) => {
              return (
                <GomakePrimaryButton key={index} onClick={tab.onclick} style={clasess.btnContainer}>{tab.name}</GomakePrimaryButton>
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