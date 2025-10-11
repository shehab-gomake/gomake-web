import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
  ThreeOptionsModal,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect, useState } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { Box, CircularProgress, Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { DocumentTypeEnums, DuplicateType, ModalType } from "@/enums";
import { PrintPackingSlipModal } from "./widgets/print-packing-slip-modal";
import { IconButton } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import QrListenerWidget from "@/widgets/qr-listener/qr-listener-widget";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { DateRangePicker } from "rsuite";
import { useRecoilState } from "recoil";
import { newOrderIdToPrintJobsState } from "@/store/new-order-id-to-print-jobs-state";
import { DotIcon } from "@/icons";
import { printHouseProfile } from "@/store/print-house-profile";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { createGlobalStyle } from "styled-components";
import {
  addOrderBoardMissionsToFileUploaderApi,
  getInitialOrderFoldersData,
  getJobsTableSettingsApi,
  printNodeModalShowLog,
} from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios } from "@/hooks";
import { fileUploaderConnectionIdState } from "@/store/file-uploader-state";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { ExcelMenu } from "../quotes/widgets/excel-menu/excel-menu";
import { useStorageList } from "@/hooks/use-storage-list";
import axios from "axios";
import { getUserToken } from "@/services/storage-data";
import { predefinedRanges } from "@/utils/dateRanges";
import QrCodeReader from "@/components/qr-code-reader";
import { QR_CODE_LISTENER_FROM } from "@/hooks/use-qr-code-listener";
import { DocumentPrimaryTable } from "@/components/tables/document-primary-table";
import {
  getJobsCustomWidth,
  jobsColumnKeys,
  parseSavedColumnSettings,
} from "./states/board-missions-columns-settings-state";
import { BoardMissionsColumnSettingsMenu } from "./widgets/board-missions-column-settings-menu/board-missions-column-settings-menu";
import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import ProductMultiSelect from "@/components/auto-complete/product-multi-select";
import { AddRuleModal } from "../products/profits-new/widgets/add-rule-modal";
import { ScheduledReportsTable } from "../quotes/widgets/scheduled-reports-table/scheduled-reports-table";
import { JobsFiltersSection } from "./components/jobs-filters-section";
import { PrimaryButton } from "@/components/button/primary-button";

const BoardMissionsListWidget = ({ isPurchaseJobs = false }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const {
    storageList,
    inputValue,
    defaultValue,
    addPrintHouseJobsStorage,
    handleStorageChange,
    setInputValue,
  } = useStorageList();
  const {
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
    openMarkReadyModalForProductType,
    onCloseMarkReadyModalForProductType,
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
    setCustomerForEdit,
    updateQuoteStatus,
    onClickCloseModal,
    openQuoteModal,
    ExportJobsTableToExcel,
    selectedMission,
    onCloseMarkReadyModalForHasJobs,
    openMarkReadyModalForHasJobs,
    cancelPrintNodeModal,
    initialPageSize,
    isHeaderSortable,
    isDescOrderBE,
    handleSortBE,
    exampleTypeValues,
    proofTypes,
    handleProofTypesChange,
    columnsReady,
    setColumnsReady,
    setColumnOrder,
    visibleHeaders,
    setColumnVisibility,
    tableKey,
    setIsPrintedState,
    isPrintedState,
    isPrintHouseUsePrintNode,
    openPrintTypeModal,
    onClosePrintTypeModal,
    handlePrintTypeChoice,
    pendingPrintParams,
    openMarkReadyTypeModal,
    onCloseMarkReadyTypeModal,
    onOpenMarkReadyTypeModal,
    pendingMarkReadyParams,
    handleMarkReadyTypeChoice,
    isJobsTableLoading,
    isJobsTableError,
    isSocketRefreshingJobs,
    // Generate Report functions
    onOpenAddRuleModal,
    onCloseAddRuleModal,
    openFilterConfirmationModal,
    onCloseFilterConfirmationModal,
    onContinueWithFilters,
    onResetFiltersAndGenerate,
    openAddRule,
    onShowScheduledReports,
    onCloseScheduledReportsModal,
    openScheduledReportsModal,
    getAvailableDateFilters,
    createScheduledReport,
    // Scheduled Reports data
    scheduledReports,
    scheduledReportsTotalCount,
    scheduledReportsIsLoading,
    scheduledReportsPageNumber,
    scheduledReportsPageSize,
    scheduledReportsPagesCount,
    onToggleScheduledReportActive,
    onDeleteScheduledReport,
    handleScheduledReportsPageChange,
    handleScheduledReportsPageSizeChange,
    // Email export modal
    showEmailModal,
    exportEmail,
    setExportEmail,
    handleEmailModalClose,
    handleExportWithEmail,
  } = useBoardMissions({ isPurchaseJobs });
  const { callApi } = useGomakeAxios();
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [connectionId] = useRecoilState(fileUploaderConnectionIdState);
  const [newOrderId, setNewOrderId] = useRecoilState(
    newOrderIdToPrintJobsState
  );
  const [openPrintNodeModal, setOpenPrintNodeModal] = useState(false);
  const [printNodeOrderId, setPrintNodeOrderId] = useState(null);
  const { CheckPreferenceValue } = usePrintHousePreferences();

  useEffect(() => {
    if (router.isReady && companyProfile.filesApiAddress && newOrderId) {
      if (
        CheckPreferenceValue(
          EPreferences.INITIALIZE_ORDER_FOLDERS_AFTER_CREATION
        )
      ) {
        const callBack = (res) => {
          debugger;
          const url =
            companyProfile.filesApiAddress + "/api/Files/CreateOrderFolder";
          axios
            .post(url, res.data, {
              headers: {
                authorization: "Bearer " + getUserToken(),
              },
            })
            .then();
        };
        getInitialOrderFoldersData(callApi, callBack, {
          orderId: newOrderId,
        }).then();
      }

      if (connectionId) {
        const callBack = (res) => {};
        addOrderBoardMissionsToFileUploaderApi(callApi, callBack, {
          orderId: newOrderId,
          connectionId: connectionId,
        }).then();
      }
    }

    if (router.isReady) {
      if (
        !!(
          isPrintHouseUsePrintNode &&
          newOrderId &&
          !CheckPreferenceValue(EPreferences.USE_PRINTNODE_AFTER_PREPRESS) &&
          !CheckPreferenceValue(EPreferences.USE_PRINTNODE_AFTER_UPLOAD_FILE)
        )
      ) {
        printNodeModalShowLog(callApi, () => {}, {
          orderId: newOrderId,
        }).then();
        setOpenPrintNodeModal(true);
        setPrintNodeOrderId(newOrderId);
      }
    }
  }, [newOrderId]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const { targetOrderId } = router?.query;

  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? "auto" : "515px")} !important;
    right: ${({ RTL }: any) => (RTL ? "530px" : "auto")} !important;
    top: 420px !important;
  }
`;

  useEffect(() => {
    const loadDocumentColumnSettings = async () => {
      try {
        const res = await getJobsTableSettingsApi(callApi, () => {}, {
          isPurchaseJobs,
        });
        const saved: ColumnSetting[] = res?.data;
        const allColumnKeys = jobsColumnKeys[tableKey];

        const filteredKeys = allColumnKeys
          .filter(
            (key) =>
              (key !== "costFromOrderItem" && key !== "priceFromOrderItem") ||
              CheckPermission(Permissions.SHOW_COSTS_IN_BOARD_MISSIONS)
          )
          .filter((key) => key !== "isPrinted" || isPrintHouseUsePrintNode);

        if (saved && saved.length > 0) {
          const { order, visibility } = parseSavedColumnSettings(
            saved,
            filteredKeys
          );
          setColumnOrder(order);
          setColumnVisibility(visibility);
        } else {
          setColumnOrder(filteredKeys);
          setColumnVisibility(
            Object.fromEntries(filteredKeys.map((key) => [key, true]))
          );
        }
      } catch (error) {
        console.error("Failed to load document column settings", error);
      } finally {
        setColumnsReady(true);
      }
    };

    loadDocumentColumnSettings();
  }, [isPurchaseJobs, tableKey]);

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={1}
        height="100%"
      >
        <QrCodeReader qrCodeListenerFrom={QR_CODE_LISTENER_FROM.JOBS} />
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

          <JobsFiltersSection
            // Customer/Supplier props
            customer={customer}
            handleCustomerChange={handleCustomerChange}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            isFetching={isFetching}
            isPurchaseJobs={isPurchaseJobs}
            // Agent props
            agent={agent}
            agentsCategories={agentsCategories}
            handleAgentChange={handleAgentChange}
            // Production status props
            status={status}
            handleStatusChange={handleStatusChange}
            productionStatuses={productionStatuses}
            // Status props
            orderStatus={orderStatus}
            handleOrderStatusChange={handleOrderStatusChange}
            orderStatuses={orderStatuses}
            // Proof types props
            proofTypes={proofTypes}
            exampleTypeValues={exampleTypeValues}
            handleProofTypesChange={handleProofTypesChange}
            // Is printed props
            isPrintedState={isPrintedState}
            setIsPrintedState={setIsPrintedState}
            isPrintHouseUsePrintNode={isPrintHouseUsePrintNode}
            // Products props
            productsList={productsList}
            productIds={productIds}
            handleMultiSelectChange={handleMultiSelectChange}
            // Date range props
            fromDate={fromDate}
            toDate={toDate}
            onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
            fromDueDate={fromDueDate}
            toDueDate={toDueDate}
            onSelectDueTimeDates={onSelectDueTimeDates}
            fromReadyDate={fromReadyDate}
            toReadyDate={toReadyDate}
            onSelectReadyTimeDates={onSelectReadyTimeDates}
            predefinedRanges={predefinedRanges}
            // Search props
            patternSearch={patternSearch}
            onChangeMissionsSearch={onChangeMissionsSearch}
            // Action props
            onClickClearFilter={handleClickClear}
            onClickSearchFilter={handleClickSearch}
            // Menu component props
            columnsReady={columnsReady}
            tableKey={tableKey}
            ExportJobsTableToExcel={ExportJobsTableToExcel}
            onGenerateReportClick={onOpenAddRuleModal}
            // Styles
            classes={classes}
          />
          {/* jobs table */}
          <>
            {columnsReady ? (
              <DocumentPrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={"calc(100vh - 250px)"}
                rows={!isPurchaseJobs ? allBoardMissions : allPurchaseJobs}
                headers={visibleHeaders}
                withSortBE={true}
                onClickSortBE={handleSortBE}
                isDescOrderBE={isDescOrderBE}
                isHeaderSortable={isHeaderSortable}
                columnWidths={visibleHeaders.map((key) =>
                  getJobsCustomWidth(tableKey, key)
                )}
                loading={isJobsTableLoading}
                error={isJobsTableError}
                disableSkeleton={isSocketRefreshingJobs}
              />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                <CircularProgress />
              </Box>
            )}
          </>
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
          initialPageSize={initialPageSize}
        />
      </Stack>
      <ThreeOptionsModal
        modalType={ModalType.DUPLICATE}
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
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyModal}
        onClose={onCloseMarkReadyModal}
        onClickYes={() => onClickMoveBoardMissionToDone(true)}
        onClickNo={() => onClickMoveBoardMissionToDone(false)}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={classes.textInputStyle}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </ThreeOptionsModal>
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle2", {
          jobNumber: selectedMission?.number,
          productType: selectedMission?.productTypeName,
        })}
        yesBtn={"modal.yes"}
        openModal={openMarkReadyModalForProductType}
        onClose={onCloseMarkReadyModalForProductType}
        onClickDelete={() => onClickMoveBoardMissionToDone(false)}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={classes.textInputStyle}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </GoMakeDeleteModal>
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
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
        modalType={ModalType.WARNING}
        title={t("boardMissions.unReadyModalTitle")}
        subTitle={" "}
        yesBtn={t("modal.confirm")}
        cancelBtn={t("modal.cancel")}
        openModal={openReturnToProdModal}
        onClose={onCloseReturnToProdModal}
        onClickDelete={onClickBackToProcess}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
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
        openModal={openPrintNodeModal}
        onClose={() => {}}
        onClickDelete={() => {
          setOpenPrintNodeModal(false);
          printOrderJobsUsingPrintNode(printNodeOrderId).then();
          setNewOrderId("");
        }}
        onClickCancel={() => {
          setOpenPrintNodeModal(false);
          cancelPrintNodeModal(printNodeOrderId).then();
          setNewOrderId("");
        }}
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
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={CLIENT_TYPE.CUSTOMER}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
      />

      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleModal")}
        subTitle={t("sales.quote.subTitleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openQuoteModal}
        onClose={onClickCloseModal}
        onClickDelete={updateQuoteStatus}
      />
      <GoMakeDeleteModal
        title={t("boardMissions.markAsReadyJobsModalTitle")}
        yesBtn={t("modal.yes")}
        modalType={ModalType.WARNING}
        subTitle={" "}
        openModal={openMarkReadyModalForHasJobs}
        onClose={onCloseMarkReadyModalForHasJobs}
        onClickDelete={() => onClickMoveBoardMissionToDone(false)}
        onClickCancel={onCloseMarkReadyModalForHasJobs}
      >
        <div style={{ width: "100%", minWidth: 300 }}>
          <GoMakeAutoComplate
            options={
              storageList?.find(
                (option: any) => option.storage === inputValue
              ) || inputValue === ""
                ? storageList
                : [
                    {
                      storage: `Add "${inputValue}" as a new storage`,
                      id: "new",
                    },
                    ...storageList,
                  ]
            }
            placeholder={t("boardMissions.selectStorage")}
            key={defaultValue}
            style={{
              width: "100%",
              border: "none",
              height: 45,
            }}
            getOptionLabel={(option: any) => option?.storage}
            value={defaultValue}
            onChange={(e: any, value: any) => {
              if (value?.id === "new") {
                addPrintHouseJobsStorage(inputValue);
                setInputValue("");
              } else {
                handleStorageChange(e, value);
                setInputValue("");
              }
            }}
            onInputChange={(event: any, newInputValue: string) => {
              setInputValue(newInputValue);
            }}
          />
        </div>
      </GoMakeDeleteModal>
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.selectPrintContent")}
        subTitle={
          pendingPrintParams?.productType
            ? t("boardMissions.askPrintType", {
                productType:
                  pendingPrintParams?.productTypeName ||
                  pendingPrintParams?.productName ||
                  pendingPrintParams?.productType,
              })
            : ""
        }
        yesBtn={"boardMissions.printAllJobs"}
        noBtn={t("boardMissions.printProductTypeOnly", {
          productType:
            pendingPrintParams?.productTypeName ||
            pendingPrintParams?.productType,
        })}
        openModal={openPrintTypeModal}
        onClose={onClosePrintTypeModal}
        onClickYes={() => handlePrintTypeChoice(true)}
        onClickNo={() => handlePrintTypeChoice(false)}
      />
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.selectMarkReadyContent")}
        subTitle={
          pendingMarkReadyParams?.productType
            ? t("boardMissions.askMarkReadyType", {
                productType:
                  pendingMarkReadyParams.productTypeName ||
                  pendingMarkReadyParams.productType,
              })
            : ""
        }
        yesBtn={t("boardMissions.markAllJobsReady")}
        noBtn={t("boardMissions.markProductTypeOnlyReady", {
          productType:
            pendingMarkReadyParams?.productTypeName ||
            pendingMarkReadyParams?.productType,
        })}
        openModal={openMarkReadyTypeModal}
        onClose={onCloseMarkReadyTypeModal}
        onClickYes={() => handleMarkReadyTypeChoice(true)}
        onClickNo={() => handleMarkReadyTypeChoice(false)}
      />

      {/* Generate Report Modals */}
      {!isPurchaseJobs && (
        <AddRuleModal
          openModal={openAddRule}
          onCloseModal={onCloseAddRuleModal}
          isQuoteWidge={true}
          filterData={{
            customerId: customer?.id,
            agentId: agent?.id,
            statusId: status?.value,
            orderStatus: orderStatus?.value,
            productIds: productIds,
            proofTypes: proofTypes,
            isPrinted: isPrintedState,
            fromDate: fromDate,
            toDate: toDate,
            fromDueDate: fromDueDate,
            toDueDate: toDueDate,
            fromReadyDate: fromReadyDate,
            toReadyDate: toReadyDate,
            patternSearch: patternSearch,
          }}
          boardMissionTableFilterDTO={{
            customerId: customer?.id,
            agentId: agent?.id,
            statusId: status?.value,
            orderStatus: orderStatus?.value,
            productIds: productIds,
            proofTypes: proofTypes,
            isPrinted: isPrintedState,
            fromDate: fromDate,
            toDate: toDate,
            fromDueDate: fromDueDate,
            toDueDate: toDueDate,
            fromReadyDate: fromReadyDate,
            toReadyDate: toReadyDate,
            patternSearch: patternSearch,
          }}
          documentType={DocumentTypeEnums.BoardMission}
          availableDateFilters={getAvailableDateFilters()}
          onShowScheduledReports={onShowScheduledReports}
          createScheduledReport={createScheduledReport}
        />
      )}

      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.list.filterConfirmationTitle")}
        subTitle={t(" ")}
        yesBtn={t("sales.list.continueWithCurrentFilters")}
        cancelBtn={t("sales.list.resetFiltersAndGenerate")}
        openModal={openFilterConfirmationModal}
        onClose={onCloseFilterConfirmationModal}
        onClickDelete={onContinueWithFilters}
        onClickCancel={onResetFiltersAndGenerate}
        style={{ width: "35%" }}
      />

      <ScheduledReportsTable
        openModal={openScheduledReportsModal}
        onCloseModal={onCloseScheduledReportsModal}
        scheduledReports={scheduledReports}
        totalCount={scheduledReportsTotalCount}
        pageNumber={scheduledReportsPageNumber}
        pageSize={scheduledReportsPageSize}
        pagesCount={scheduledReportsPagesCount}
        isLoading={scheduledReportsIsLoading}
        onToggleActive={onToggleScheduledReportActive}
        onDelete={onDeleteScheduledReport}
        onPageChange={handleScheduledReportsPageChange}
        onPageSizeChange={handleScheduledReportsPageSizeChange}
      />

      {/* Email Export Modal */}
      <GoMakeModal
        openModal={showEmailModal}
        onClose={handleEmailModalClose}
        modalTitle={t("boardMissions.exportToExcel")}
        insideStyle={{ width: "400px", height: "fit-content" }}
      >
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h4>{t("boardMissions.enterEmailForExport")}</h4>
            <GomakeTextInput
              placeholder={t("boardMissions.emailPlaceholder")}
              value={exportEmail}
              onChange={(e) => setExportEmail(e.target.value)}
              type="email"
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <PrimaryButton
              variant="outlined"
              onClick={handleEmailModalClose}
            >
              {t("modal.cancel")}
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              onClick={handleExportWithEmail}
              disabled={!exportEmail || !exportEmail.includes("@")}
            >
              {t("boardMissions.sendToEmail")}
            </PrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { BoardMissionsListWidget };
