import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeAutoComplate, GoMakeDeleteModal, GomakePrimaryButton, ThreeOptionsModal } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DuplicateType } from "@/enums";
import { PrintPackingSlipModal } from "./widgets/print-packing-slip-modal";
import { IconButton } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import { useRecoilValue } from "recoil";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import QrListenerWidget from "@/widgets/qr-listener/qr-listener-widget";

const BoardMissionsListWidget = ({ isPurchaseJobs = false }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
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
    resetDatePicker,
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
    onOpenMarkReadyModal,
    missionItem,
    onClickPrintPackagingSlip,
    openMarkReadyThenPrintModal,
    onCloseMarkReadyThenPrintModal,
    onOpenMarkReadyThenPrintModal,
    onClickMoveBoardMissionToDone,
    onClickBackToProcess,
    handleClick,
    handleClose,
    selectedMission,
    open,
    anchorEl,
    supplierId,
    supplierList
  } = useBoardMissions({ isPurchaseJobs });

  useEffect(() => {
    getAllProducts();
  }, []);
  const suppliersState = useRecoilValue(outsourceSuppliersState);
  return (
    <>
      <Stack direction="column" justifyContent="space-between" display="flex" spacing={1} height="100%" >
        <div style={classes.mainContainer}>
          <HeaderTitle title={!isPurchaseJobs ? t("boardMissions.title") : t("boardMissions.purchaseJobsTitle")} marginTop={1} marginBottom={1} />
          <SearchInputComponent
            searchInputStyle={{ width: "20vw" }}
            filtersButton={
              <InputAdornment position="start">
                <div>
                  <IconButton onClick={handleClick}>
                    <TuneIcon />
                  </IconButton>
                  <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl} >
                    <div style={classes.filtersContainer}>
                      <div style={classes.selectedFilterContainer}>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>{t("sales.quote.agent")}</h3>
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
                          <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
                          <GoMakeAutoComplate
                            key={customer?.id}
                            options={renderOptions()}
                            onChangeTextField={checkWhatRenderArray}
                            getOptionLabel={(option: any) => `${option.name}`}
                            style={classes.textInputStyle}
                            placeholder={t("sales.quote.chooseCustomer")}
                            onChange={handleCustomerChange}
                            value={customer}
                            withArrow={true}
                          />
                        </div>
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>{t("boardMissions.productionStatus")}</h3>
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
                          <h3 style={classes.filterLabelStyle}>{t("boardMissions.products")}</h3>
                          <GoMakeMultiSelect
                            onChange={handleMultiSelectChange}
                            style={classes.textInputStyle}
                            options={productsList}
                            values={productIds}
                            placeholder={t("boardMissions.selectProducts")} />
                        </div>
                        {isPurchaseJobs && <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>{t("sales.quote.supplierName")}</h3>
                          <GoMakeAutoComplate
                            placeholder={"Select supplier"}
                            value={supplierId}
                            style={classes.textInputStyle}
                            onChange={handledSupplierIdChange}
                            options={supplierList?.map((s) => ({
                              value: s.id,
                              label: s.name,
                            }))}
                            withArrow={true}
                          />

                        </div>}
                        <div style={classes.statusFilterContainer}>
                          <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
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
          />
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={650}
            rows={!isPurchaseJobs ? allBoardMissions : allPurchaseJobs}
            headers={!isPurchaseJobs ? tableHeader : tableHeaderForPurchaseJobs}
          />
        </div>
        <GoMakePagination
          onChangePageNumber={handlePageChange}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
        />
      </Stack>

      <ThreeOptionsModal
        title={t("boardMissions.duplicateModalTitle")}
        yesBtn={"boardMissions.duplicateModalYes"}
        noBtn={"boardMissions.duplicateModalNo"}
        openModal={openDuplicateModal}
        onClose={onCloseDuplicateModal}
        onClickYes={() => onClickDuplicateMission(DuplicateType.SameBoardMissionNumber)}
        onClickNo={() => onClickDuplicateMission(DuplicateType.NewBoardMissionNumber)}
      />

      <ThreeOptionsModal
        title={selectedMission?.isReady ? t("boardMissions.unReadyModalTitle") : t("boardMissions.markDoneModalTitle")}
        subTitle={selectedMission?.isReady ? t("boardMissions.unReadyModalSubTitle") : t("boardMissions.markDoneModalSubTitle")}
        yesBtn={selectedMission?.isReady ? "boardMissions.unReadyWitNotification" : "boardMissions.markDoneModalYes"}
        noBtn={selectedMission?.isReady ? "boardMissions.unReadyWithouNotification" : "boardMissions.markDoneModalNo"}
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
        icon={<WarningAmberIcon style={classes.warningIconStyle} />}
        title={t("boardMissions.returnToProductionModalTitle")}
        yesBtn={t("modal.yes")}
        cancelBtn={t("modal.no")}
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
      <QrListenerWidget listening={true}/>
    </>
  );
};

export { BoardMissionsListWidget };