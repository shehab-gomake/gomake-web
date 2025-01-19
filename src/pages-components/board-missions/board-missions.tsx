import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import { PrimaryTable } from "@/components/tables/primary-table";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
  ThreeOptionsModal,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { DuplicateType, ModalType } from "@/enums";
import { PrintPackingSlipModal } from "./widgets/print-packing-slip-modal";
import { IconButton } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import QrListenerWidget from "@/widgets/qr-listener/qr-listener-widget";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { DateRangePicker } from "rsuite";
import { useRecoilState, useRecoilValue } from "recoil";
import { newOrderIdToPrintJobsState } from "@/store/new-order-id-to-print-jobs-state";
import { DotIcon } from "@/icons";
import { printHouseUsePrintNode } from "@/store/print-house-profile";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { isValidCustomer } from "@/utils/helpers";

const BoardMissionsListWidget = ({ isPurchaseJobs = false }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const {
    tableHeader,
    tableHeaderForPurchaseJobs,
    renderOptions,
    customer,
    agent,
    status,
    agentsCategories,
    productionStatuses,
    productIds,
    handleMultiSelectChange,
    getAllProducts,
    productsList,
    onChangeMissionsSearch,
    handleClickSearch,
    handleClickClear,
    allBoardMissions,
    allPurchaseJobs,
    patternSearch,
    handleAgentChange,
    handleStatusChange,
    handledSupplierIdChange,
    handleCustomerChange,
    checkWhatRenderArray,
    handlePageChange,
    pagesCount,
    pageNumber,
    setPageNumber,
    onSelectDeliveryTimeDates,
    onSelectDueTimeDates,
    onSelectReadyTimeDates,
    handlePageSizeChange,
    pageSize,
    openDuplicateModal,
    onCloseDuplicateModal,
    openMarkReadyModal,
    onCloseMarkReadyModal,
    openReturnToProdModal,
    onCloseReturnToProdModal,
    onClickDuplicateMission,
    openPackagesModal,
    onClosePackagesModal,
    quantityPerPackage,
    quantityOfPackages,
    packageInputs,
    handleQuantityPerPackageChange,
    handleQuantityOfPackagesChange,
    openModal,
    onCloseModal,
    onOpenPackagesModal,
    missionItem,
    onClickPrintPackagingSlip,
    openMarkReadyThenPrintModal,
    onCloseMarkReadyThenPrintModal,
    onOpenMarkReadyThenPrintModal,
    onClickMoveBoardMissionToDone,
    onClickBackToProcess,
    handleClick,
    handleClose,
    open,
    anchorEl,
    supplierId,
    supplierList,
    orderStatuses,
    orderStatus,
    handleOrderStatusChange,
    fromReadyDate,
    toReadyDate,
    fromDueDate,
    toDueDate,
    fromDate,
    toDate,
    router,
    isFetching,
    printOrderJobsUsingPrintNode,
    searchInputRef,
    showCustomerModal,
    customerForEdit,
    setShowCustomerModal,
    setCustomerForEdit
  } = useBoardMissions({ isPurchaseJobs });
  const [newOrderId, setNewOrderId] = useRecoilState(
    newOrderIdToPrintJobsState
  );
  const isPrintHouseUsePrintNode = useRecoilValue(printHouseUsePrintNode);

  useEffect(() => {
    getAllProducts();
  }, []);

  const { targetOrderId } = router?.query;
  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={1}
        height="100%"
      >
        <div style={classes.mainContainer}>
          <HeaderTitle
            title={
              !isPurchaseJobs
                ? t("boardMissions.title")
                : t("boardMissions.purchaseJobsTitle")
            }
            marginTop={1}
            marginBottom={1}
          />
          <SearchInputComponent
            searchInputStyle={{ width: 400 }}
            filtersButton={
              <InputAdornment position="start">
                <div>
                  <IconButton onClick={handleClick}>
                    <TuneIcon />
                    {Object.keys(router.query).filter(
                      (key) => key !== "pageNumber"
                    ).length > 0 && (
                        <div style={{ position: "absolute", top: -5, right: -1 }}>
                          <DotIcon />
                        </div>
                      )}
                  </IconButton>
                  <GoMakeMenu
                    handleClose={handleClose}
                    open={open}
                    anchorEl={anchorEl}
                  >
                    <div style={classes.filtersContainer}>
                      <div style={classes.selectedFilterContainer}>
                        {/* here */}
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("sales.quote.customer")}
                          </h3>
                          <GoMakeAutoComplate
                            key={customer?.id}
                            options={renderOptions()}
                            defaultFiltering={false}
                            onChangeTextField={checkWhatRenderArray}
                            getOptionLabel={(option: any) => `${option.name}`}
                            style={classes.textInputStyle}
                            placeholder={t("sales.quote.chooseCustomer")}
                            onChange={handleCustomerChange}
                            value={customer}
                            withArrow={true}
                            loading={isFetching} // Pass loading state here
                          />
                        </div>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("sales.quote.agent")}
                          </h3>
                          <GoMakeAutoComplate
                            key={agent?.id}
                            options={agentsCategories}
                            style={classes.textInputStyle}
                            getOptionLabel={(option: any) => option.label}
                            placeholder={t("sales.quote.ChooseAgent")}
                            onChange={handleAgentChange}
                            value={agent}
                            withArrow={true}
                          />
                        </div>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("boardMissions.productionStatus")}
                          </h3>
                          <GoMakeAutoComplate
                            key={status?.value}
                            options={productionStatuses}
                            style={classes.textInputStyle}
                            placeholder={t("boardMissions.productionStatus")}
                            onChange={handleStatusChange}
                            value={status}
                            withArrow={true}
                          />
                        </div>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("boardMissions.orderStatus")}
                          </h3>
                          <GoMakeAutoComplate
                            key={orderStatus?.value}
                            options={orderStatuses}
                            style={classes.textInputStyle}
                            placeholder={t("boardMissions.orderStatus")}
                            onChange={handleOrderStatusChange}
                            value={orderStatus}
                            withArrow={true}
                          />
                        </div>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("boardMissions.products")}
                          </h3>
                          <GoMakeMultiSelect
                            onChange={handleMultiSelectChange}
                            style={classes.textInputForProductsStyle}
                            options={productsList}
                            values={productIds}
                            placeholder={t("boardMissions.selectProducts")}
                          />
                        </div>
                        {isPurchaseJobs && (
                          <div style={classes.statusFilterContainer}>
                            <h3 style={classes.filterLabelStyle}>
                              {t("sales.quote.supplierName")}
                            </h3>
                            <GoMakeAutoComplate
                              placeholder={"Select supplier"}
                              value={supplierId}
                              style={classes.textInputForProductsStyle}
                              onChange={handledSupplierIdChange}
                              options={supplierList?.map((s) => ({
                                value: s.id,
                                label: s.name,
                              }))}
                              withArrow={true}
                            />
                          </div>
                        )}
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("boardMissions.dateRange")}
                          </h3>
                          <DateRangePicker
                            onChange={onSelectDeliveryTimeDates}
                            value={
                              fromDate && toDate ? [fromDate, toDate] : null
                            }
                          />
                        </div>

                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("Due Date")}
                          </h3>
                          <DateRangePicker
                            onChange={onSelectDueTimeDates}
                            value={
                              fromDueDate && toDueDate
                                ? [fromDueDate, toDueDate]
                                : null
                            }
                          />
                        </div>

                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>
                            {t("Ready Date")}
                          </h3>
                          <DateRangePicker
                            onChange={onSelectReadyTimeDates}
                            value={
                              fromReadyDate && toReadyDate
                                ? [fromReadyDate, toReadyDate]
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div style={classes.buttonsFiltersContainer}>
                        <div style={classes.buttonsFilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.clearBtnStyle}
                            onClick={handleClickClear}
                          >
                            {t("sales.quote.clear")}
                          </GomakePrimaryButton>
                        </div>
                        <div style={classes.buttonsFilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.searchBtnStyle}
                            onClick={handleClickSearch}
                          >
                            {t("sales.quote.search")}
                          </GomakePrimaryButton>
                        </div>
                      </div>
                    </div>
                  </GoMakeMenu>
                </div>
              </InputAdornment>
            }
            onChange={onChangeMissionsSearch}
            value={patternSearch}
            inputRef={searchInputRef}
          />
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={"calc(100vh - 250px)"}
            rows={!isPurchaseJobs ? allBoardMissions : allPurchaseJobs}
            headers={!isPurchaseJobs ? tableHeader : tableHeaderForPurchaseJobs}
            columnWidths={
              !isPurchaseJobs
                ? CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
                  ? [
                    "7%",
                    "7%",
                    "6%",
                    "6%",
                    "7%",
                    "7%",
                    "8%",
                    "7%",
                    "4%",
                    "6%",
                    "12%",
                    "7%",
                    "7%",
                    "13%",
                    "3%",
                  ]
                  : [
                    "7%",
                    "7%",
                    "7%",
                    "7%",
                    "7%",
                    "7%",
                    "8%",
                    "7%",
                    "18%",
                    "7%",
                    "15%",
                    "7%",
                    "3%",
                  ]
                : [
                  "7%",
                  "5%",
                  "6%",
                  "7%",
                  "6%",
                  "7%",
                  "11%",
                  "8%",
                  "6%",
                  "8%",
                  "5%",
                  "5%",
                  "7%",
                  "7%",
                  "4%",
                  "2%",
                ]
            }
          />
        </div>
        <GoMakePagination
          onChangePageNumber={handlePageChange}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
          router={router}
          isFromDocumentsOrJobs={true}
        />
      </Stack>
      <ThreeOptionsModal
        title={t("boardMissions.duplicateModalTitle")}
        yesBtn={"boardMissions.duplicateModalYes"}
        noBtn={"boardMissions.duplicateModalNo"}
        openModal={openDuplicateModal}
        onClose={onCloseDuplicateModal}
        onClickYes={() =>
          onClickDuplicateMission(
            targetOrderId
              ? DuplicateType.SameOrderAndSameBoardMissionNumber
              : DuplicateType.SameBoardMissionNumber
          )
        }
        onClickNo={() =>
          onClickDuplicateMission(
            targetOrderId
              ? DuplicateType.SameOrder
              : DuplicateType.NewBoardMissionNumber
          )
        }
      />
      <ThreeOptionsModal
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyModal}
        onClose={onCloseMarkReadyModal}
        onClickYes={() => onClickMoveBoardMissionToDone(true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false)}
      />
      <ThreeOptionsModal
        title={t("boardMissions.markDoneFromPrintSlipModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyThenPrintModal}
        onClose={onCloseMarkReadyThenPrintModal}
        onClickYes={() => onOpenPackagesModal(missionItem)}
        onClickNo={() => onOpenPackagesModal(missionItem)}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        modalType={ModalType.WARNING}
        title={t("boardMissions.unReadyModalTitle")}
        subTitle={t("boardMissions.unReadyModalSubTitle")}
        yesBtn={t("boardMissions.unReadyWitNotification")}
        cancelBtn={t("modal.cancel")}
        openModal={openReturnToProdModal}
        onClose={onCloseReturnToProdModal}
        onClickDelete={onClickBackToProcess}
      />
      <ThreeOptionsModal
        title={t("boardMissions.printAndMoveToReadyTitle")}
        yesBtn={t("boardMissions.printAndTransferToReady")}
        noBtn={t("boardMissions.printOnly")}
        openModal={openModal}
        onClose={onCloseModal}
        onClickYes={onOpenMarkReadyThenPrintModal}
        onClickNo={() => onOpenPackagesModal(missionItem)}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.printOrderJobsModalTitle")}
        subTitle={" "}
        yesBtn={t("sales.quote.print")}
        openModal={!!newOrderId && isPrintHouseUsePrintNode}
        onClose={() => setNewOrderId("")}
        onClickDelete={() => printOrderJobsUsingPrintNode(newOrderId)}
        cancelBtn={t("modal.cancel")}
      />
      <PrintPackingSlipModal
        openPackagesModal={openPackagesModal}
        onClosePackagesModal={onClosePackagesModal}
        packageInputs={packageInputs}
        quantityOfPackages={quantityOfPackages}
        quantityPerPackage={quantityPerPackage}
        handleQuantityOfPackagesChange={handleQuantityOfPackagesChange}
        handleQuantityPerPackageChange={handleQuantityPerPackageChange}
        onClickConfirm={onClickPrintPackagingSlip}
      />
      <QrListenerWidget listening={true} />
      <CustomerCardWidget
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={CLIENT_TYPE.CUSTOMER}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        modalTitle={t("customers.modal.editTitle")}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
        showUpdateButton={true}
      />
    </>
  );
};

export { BoardMissionsListWidget };
