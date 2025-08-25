import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
  SecondSwitch,
  ThreeOptionsModal,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect, useState } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { Box, CircularProgress, Stack } from "@mui/material";
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
import { useRecoilState, } from "recoil";
import { newOrderIdToPrintJobsState } from "@/store/new-order-id-to-print-jobs-state";
import { DotIcon } from "@/icons";
import {
  printHouseProfile,
} from "@/store/print-house-profile";
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
        const callBack = (res) => { };
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
        printNodeModalShowLog(callApi, () => { }, {
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
        const res = await getJobsTableSettingsApi(callApi, () => { }, {
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
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <SearchInputComponent
              searchInputStyle={{ width: 400 }}
              filtersButton={
                <InputAdornment position="start">
                  <div>
                    <IconButton onClick={handleClick}>
                      <TuneIcon />
                      {Object.keys(router.query).filter(
                        (k) => k !== "pageNumber" && k !== "pageSize"
                      ).length > 0 && (
                          <div
                            style={{ position: "absolute", top: -5, right: -1 }}
                          >
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
                          <div style={classes.statusFilterContainer}>
                            <h3 style={classes.filterLabelStyle}>
                              {isPurchaseJobs
                                ? t("reports.supplier")
                                : t("sales.quote.customer")}
                            </h3>
                            <ClientAutocomplete
                              key={customer?.id}
                              clientType={
                                isPurchaseJobs
                                  ? CLIENT_TYPE.SUPPLIER
                                  : CLIENT_TYPE.CUSTOMER
                              }
                              options={renderOptions() ? renderOptions() : []}
                              onChangeTextField={checkWhatRenderArray}
                              getOptionLabel={(option: any) => `${option.name}`}
                              style={classes.textInputStyle}
                              onChange={handleCustomerChange}
                              value={customer}
                              withArrow={true}
                              loading={isFetching}
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
                              {t("products.offsetPrice.admin.proof")}
                            </h3>
                            <GoMakeMultiSelect
                              onChange={handleProofTypesChange}
                              style={{
                                ...classes.textInputForProductsStyle,
                                ...(!!isPrintHouseUsePrintNode && {
                                  width: "100%",
                                }),
                              }}
                              options={
                                exampleTypeValues?.map((option) => ({
                                  label: t(
                                    `products.proofTypes.${option.value}`
                                  ),
                                  value: option.key,
                                })) || []
                              }
                              values={proofTypes}
                              placeholder={t(
                                "products.offsetPrice.admin.proof"
                              )}
                            />
                          </div>

                          {!!isPrintHouseUsePrintNode && (
                            <div style={classes.statusFilterContainer}>
                              <h3 style={classes.filterLabelStyle}>
                                {t("boardMissions.isPrinted")}
                              </h3>
                              <GoMakeAutoComplate
                                options={[
                                  { value: true, text: t("modal.yes") },
                                  { value: false, text: t("modal.no") }
                                ]}
                                getOptionLabel={(option: any) => option.text}
                                placeholder={t("boardMissions.isPrinted")}
                                style={classes.textInputStyle}
                                onChange={(e, value) => setIsPrintedState(value?.value ?? null)}
                                value={
                                  isPrintedState === null
                                    ? null
                                    : isPrintedState === true
                                      ? { value: true, text: t("modal.yes") }
                                      : { value: false, text: t("modal.no") }
                                }
                              />
                            </div>
                          )}
                          <div style={classes.statusFilterContainer}>
                            <ProductMultiSelect
                              products={productsList}
                              selectedProductIds={productIds}
                              onProductChange={handleMultiSelectChange}
                              placeholder={t("boardMissions.selectProducts")}
                              label={t("boardMissions.products")}
                              labelStyle={classes.filterLabelStyle}
                              selectStyle={classes.textInputForProductsStyle}
                            />
                          </div>
                          {/* <div style={classes.statusFilterContainer}>
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
                          </div> */}
                          <div style={classes.statusFilterContainer}>
                            <GlobalStyle RTL={RTL} />
                            <h3 style={classes.filterLabelStyle}>
                              {t("boardMissions.dateRange")}
                            </h3>
                            <DateRangePicker
                              onChange={onSelectDeliveryTimeDates}
                              value={
                                fromDate && toDate ? [fromDate, toDate] : null
                              }
                              ranges={predefinedRanges}
                            />
                          </div>

                          <div style={classes.statusFilterContainer}>
                            <GlobalStyle RTL={RTL} />
                            <h3 style={classes.filterLabelStyle}>
                              {t("boardMissions.dueDate")}
                            </h3>
                            <DateRangePicker
                              onChange={onSelectDueTimeDates}
                              value={
                                fromDueDate && toDueDate
                                  ? [fromDueDate, toDueDate]
                                  : null
                              }
                              ranges={predefinedRanges}
                            />
                          </div>
                          <div style={classes.statusFilterContainer}>
                            <GlobalStyle RTL={RTL} />
                            <h3 style={classes.filterLabelStyle}>
                              {t("boardMissions.readyDate")}
                            </h3>
                            <DateRangePicker
                              onChange={onSelectReadyTimeDates}
                              value={
                                fromReadyDate && toReadyDate
                                  ? [fromReadyDate, toReadyDate]
                                  : null
                              }
                              ranges={predefinedRanges}
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

            <Stack direction={"row"} gap={1}>
              {columnsReady && (
                <BoardMissionsColumnSettingsMenu
                  tableKey={tableKey}
                  isPurchaseJobs={isPurchaseJobs}
                />
              )}
              {!isPurchaseJobs && (
                <ExcelMenu
                  onExportTableClick={ExportJobsTableToExcel}
                  documentType={null}
                />
              )}
            </Stack>
          </div>
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
        onClose={() => { }}
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
              productType: pendingPrintParams?.productTypeName || pendingPrintParams?.productName || pendingPrintParams?.productType
            })
            : ""
        }
        yesBtn={"boardMissions.printAllJobs"}
        noBtn={t("boardMissions.printProductTypeOnly", {
          productType: pendingPrintParams?.productTypeName || pendingPrintParams?.productType
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
              productType: pendingMarkReadyParams.productTypeName || pendingMarkReadyParams.productType
            })
            : ""
        }
        yesBtn={t("boardMissions.markAllJobsReady")}
        noBtn={t("boardMissions.markProductTypeOnlyReady", {
          productType: pendingMarkReadyParams?.productTypeName || pendingMarkReadyParams?.productType
        })}
        openModal={openMarkReadyTypeModal}
        onClose={onCloseMarkReadyTypeModal}
        onClickYes={() => handleMarkReadyTypeChoice(true)}
        onClickNo={() => handleMarkReadyTypeChoice(false)}
      />
    </>
  );
};

export { BoardMissionsListWidget };
