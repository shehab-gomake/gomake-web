
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useadJustmentsModal } from "./use-adjustments-modal";

import { useStyle } from "./style";
import { TransferBalanceModal } from "../transfer-balance-modal";

const AdjustmentsLedgerReportModal = ({ openModal, onCloseModal, clientPaymentsList, getClientPaymentItems }) => {
  const { clasess } = useStyle();
  const {
    getTableDataRows,
    calculateTotalPrice,
    tableHeaders,
    btns,
    openDeleteModal,
    onClickCloseDeleteModal,
    cancelTransactionsApi,
    openTransferModal,
    onClickCloseTransferModal,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    transferBalanceApi
  } = useadJustmentsModal({ clientPaymentsList, getClientPaymentItems })

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Adjustments Lists"
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