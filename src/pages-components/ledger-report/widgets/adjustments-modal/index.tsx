import { GoMakeDeleteModal, GoMakeModal } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { TransferBalanceModal } from "../transfer-balance-modal";
import { useAdjustmentsModal } from "./use-adjustments-modal";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Skeleton } from "@mui/material";
import { ModalType } from "@/enums";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";
import { NoDataComponent } from "@/widgets/quote-new/receipts-table/Payment-methods-details/no-data-component";

const AdjustmentsLedgerReportModal = ({
  openModal,
  onCloseModal,
  clientPaymentsList,
  getClientPaymentItems,
  customerId,
  setClientPaymentsList,
  isLoading,
  hasFetchedOnce,
}) => {
  const { classes } = useStyle();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);

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
    isFetching,
    setSelectedItems,
  } = useAdjustmentsModal({
    clientPaymentsList,
    getClientPaymentItems,
    customerId,
  });

  const handleModalClose = () => {
    setClientPaymentsList([]);
    setSelectedItems([]);
    onCloseModal();
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={
          isLoading ||
          !hasFetchedOnce ||
          (clientPaymentsList && clientPaymentsList.length > 0)
            ? t("reports.adjustmentsLists")
            : " "
        }
        onClose={handleModalClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          {isLoading || !hasFetchedOnce ? (
            <>
              <Skeleton
                height={600}
                variant="rectangular"
                width="100%"
                style={{ borderRadius: 8 }}
              />
              <div style={classes.btnsContainer}>
                {[...Array(btns.length)].map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width={"33%"}
                    height={40}
                    style={{ borderRadius: 8 }}
                  />
                ))}
              </div>
            </>
          ) : clientPaymentsList?.length > 0 ? (
            <>
              <PrimaryTable
                rows={getTableDataRows()}
                headers={tableHeaders}
                maxHeight={500}
                stickyHeader={true}
                columnWidths={["5%", "14%", "14%", "14%", "14%", "14%", "25%"]}
              />
              <div style={classes.totalPriceContainer}>
                {calculateTotalPrice().toFixed(3)} {systemCurrency}
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
          ) : (
            <NoDataComponent subNoDataText={t("reports.noAdjustments")} />
          )}
        </div>
        <GoMakeDeleteModal
          modalType={ModalType.DELETE}
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
          isFetchingCustomers={isFetching}
        />
      </GoMakeModal>
    </>
  );
};

export { AdjustmentsLedgerReportModal };
