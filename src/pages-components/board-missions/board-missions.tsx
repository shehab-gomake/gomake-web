import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeAutoComplate, GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton, GomakeTextInput, ThreeOptionsModal } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect, useMemo, useState } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DuplicateType } from "@/enums";
import { PrintPackingSlipModal } from "./widgets/print-packing-slip-modal";

const BoardMissionsListWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeader,
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
    missionItem
  } = useBoardMissions();

  useEffect(() => {
    getAllProducts();
  }, []);




  return (
    <>
      <Stack direction="column" justifyContent="space-between" display="flex" spacing={1} height="100%" >
        <div style={classes.mainContainer}>
          <HeaderTitle title={t("boardMissions.title")} marginTop={1} marginBottom={1} />
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
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
              </div>
              <GomakePrimaryButton
                style={classes.searchBtnStyle}
                onClick={handleClickSearch}
              >{t("sales.quote.search")}
              </GomakePrimaryButton>
              <GomakePrimaryButton
                style={classes.clearBtnStyle}
                onClick={handleClickClear}
              >{t("sales.quote.clear")}
              </GomakePrimaryButton>
            </div>
            <SearchInputComponent onChange={onChangeMissionsSearch} value={patternSearch} />
          </div>
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={650}
            rows={allBoardMissions}
            headers={tableHeader}
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
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={openMarkReadyModal}
        onClose={onCloseMarkReadyModal}
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
        onClickDelete={() => alert("loading")}
      />
      <ThreeOptionsModal
        title={t("Would you like to print a delivery slip and move the order to ready?")}
        yesBtn={"Print and transfer to ready"}
        noBtn={"Printing only"}
        openModal={openModal}
        onClose={onCloseModal}
        onClickYes={onOpenMarkReadyModal}
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
      />
    </>
  );
};

export { BoardMissionsListWidget };