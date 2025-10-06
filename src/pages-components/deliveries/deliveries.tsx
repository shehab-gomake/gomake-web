import QRScannerFab from "@/widgets/qr-scanner/qr-scanner-fab";
import { HeaderTitle } from "@/widgets";
import { useDeliveries } from "./use-deliveries";
import { Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { GoMakeDeleteModal, ThreeOptionsModal } from "@/components";
import { DeliveriesFiltersSection } from "./components/deliveries-filters-section";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { UpdateDeliveryStatusModal } from "../quotes/widgets/delivery-status-button/delivery-status-modal/delivery-status-modal";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useClientContactsList } from "@/hooks/use-client-contacts";
import { useDeliveryStatusButton } from "../quotes/widgets/delivery-status-button/use-delivery-status";
import { ModalType } from "@/enums";

const DeliveriesPageWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    isMobile,
    tableHeaders,
    handlePageSizeChange,
    pageSize,
    page,
    pagesCount,
    setPage,
    router,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
    agent,
    patternSearch,
    onChangeDocumentSearch,
    onClickClearFilter,
    onClickSearchFilter,
    agentsCategories,
    handleAgentChange,
    deliveryTypeValue,
    setDeliveryTypeValue,
    getAllShipmentTypes,
    shipmentTypes,
    allDeliveries,
    orderId,
    customerId,
    documentNumber,
    initialPageSize,
    MoveOrderToReady,
    onClickCloseMoveOrderToReadyModal,
    onClickOpenMoveOrderToReadyModal,
    moveOrderToReady,
  } = useDeliveries();

  const {
    openDeliveryModal,
    onCloseDeliveryModal,
    renderTableRows,
    editableQuantities,
    setEditableQuantities,
    setDocumentItems,
    getDocumentDeliveryItems,
    selectedItem,
    removeDocumentDeliveryItem,
    onCloseDeleteModal,
    openDeleteModal,
  } = useDeliveryStatusButton();

  const { getClientContacts, clientContacts } = useClientContactsList();

  const handleOpenDeliveryModal = (orderId) => {
    getDocumentDeliveryItems(DOCUMENT_TYPE.order, orderId);
    getClientContacts(customerId);
  };

  const handleCloseDeliveryModal = () => {
    onCloseDeliveryModal();
    router.push(router.pathname, undefined, { shallow: true });
  };

  useEffect(() => {
    getAllShipmentTypes(true);
  }, []);

  useEffect(() => {
    if (orderId) {
      handleOpenDeliveryModal(orderId);
    }
  }, [router.query.orderId]);

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={2}
        height="100%"
      >
        <div style={classes.mainContainer}>
          {/* header section */}
          <div
            style={{
              ...classes.headerStyle,
              ...(isMobile && { marginTop: "10px" }),
            }}
          >
            <HeaderTitle
              title={t("tabs.deliveries")}
              marginTop={1}
              marginBottom={1}
            />
          </div>
          {/* filters */}
          <DeliveriesFiltersSection
            customer={customer}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            isFetching={isFetching}
            handleCustomerChange={handleCustomerChange}
            agent={agent}
            agentsCategories={agentsCategories}
            handleAgentChange={handleAgentChange}
            deliveryTypeValue={deliveryTypeValue}
            setDeliveryTypeValue={setDeliveryTypeValue}
            shipmentTypes={shipmentTypes}
            patternSearch={patternSearch}
            onChangeDocumentSearch={onChangeDocumentSearch}
            onClickClearFilter={onClickClearFilter}
            onClickSearchFilter={onClickSearchFilter}
            classes={classes}
          />
          {/* table */}
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={"calc(100vh - 265px)"}
            rows={allDeliveries}
            headers={tableHeaders}
          />
        </div>
        <GoMakePagination
          onChangePageNumber={(event, value) => {
            setPage(value);
            router.push({
              pathname: router.pathname,
              query: { ...router.query, pageNumber: value },
            });
          }}
          onChangePageSize={handlePageSizeChange}
          page={page}
          setPage={setPage}
          pagesCount={pagesCount}
          pageSize={pageSize}
          router={router}
          isFromDocumentsOrJobs={true}
          isMobile={isMobile}
          initialPageSize={initialPageSize}
        />
      </Stack>
      <QRScannerFab />
      <UpdateDeliveryStatusModal
        openModal={openDeliveryModal}
        onCloseModal={handleCloseDeliveryModal}
        document={document}
        documentItems={renderTableRows()}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
        clientContacts={clientContacts}
        documentType={DOCUMENT_TYPE.order}
        documentId={orderId?.toString()}
        documentNumber={documentNumber?.toString()}
        onClickOpenMoveOrderToReadyModal={onClickOpenMoveOrderToReadyModal}
      />

      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={MoveOrderToReady.isOpen}
        onClose={onClickCloseMoveOrderToReadyModal}
        onClickYes={() => moveOrderToReady(true)}
        onClickNo={() => moveOrderToReady(false)}
      />

      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        onClickDelete={() => removeDocumentDeliveryItem(selectedItem)}
      />
    </>
  );
};

export { DeliveriesPageWidget };
