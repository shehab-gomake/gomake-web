import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useMaterials } from "@/widgets/materials-widget/use-materials";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/materials-widget/style";
import { FiltersActionsBar } from "@/widgets/materials-widget/components/filters/filters-actions-bar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  flagState,
  isDuplicateCategoryModalState,
  isEditCategoryModalState,
  openAddCategoryModalState,
  openAddRowModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { AddSupplierModal } from "@/widgets/materials-widget/components/add-supplier/add-supplier-modal";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import { AddCategoryModal } from "./components/add-category/add-category-modal";
import { AddRowModal } from "./components/add-row/add-row-modal";
import { useMaterialsCategories } from "./use-materials-categories";
import Pagination from "@mui/material/Pagination";
import { GoMakeDeleteModal, GomakePrimaryButton, ThreeOptionsModal } from "@/components";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { Skeleton, Stack, Box, IconButton } from "@mui/material";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { UpdatedNumburingModal } from "./components/updated-numbering/updated-numbering-modal";
import { CreatePurchaseOrderModal } from "./components/create-purchase-order-modal/create-purchase-order-modal";
import { useTableCellData } from "./components/table-cell-data/use-table-cell-data";
import { ModalType } from "@/enums";
import { isLoadgingState, isLoadingMaterialsState } from "@/store";
import { EMaterialActiveFilter } from "./enums";
import { CombinedTable } from "./components/combined-table/combined-table";
interface IMaterialsWidgetProps {
  isAdmin: boolean;
}
const MaterialsWidget = (props: IMaterialsWidgetProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const dir: "rtl" | "ltr" = t("direction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { getMaterialCategoryData, pagesCount, pageNumber, setPageNumber } =
    useMaterialsCategories(props.isAdmin);
  const pageSize = 14;
  const activeFilter = useRecoilValue(activeFilterState);
  const setOpenAddRowModal = useSetRecoilState(openAddRowModalState);
  const {
    openPriceModal,
    onClickClosePriceModal,
    updateProfitProfileProductHidden,
  } = useTableCellData(props.isAdmin);
  const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
  const changeEditCategoryModalState = useSetRecoilState(
    isEditCategoryModalState
  );
  const changeDuplicateCategoryModalState = useSetRecoilState(
    isDuplicateCategoryModalState
  );
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const flag = useRecoilValue(flagState);
  const {
    materialCategory,
    materialType,
    materialsCategoriesList,
    onSelectCategory,
    getCurrenciesApi,
    getMaterialCategories,
    getMaterialTableHeaders,
    getPrintHouseMaterialCategorySuppliers,
    materialCategoryData,
    replace,
    materialCategories,
    tableHeadersNew,
    tableRowsNew,
    getMachinesMaterials,
    getClientsMaterials,
    materialFilter,
    openDeleteRowModal,
    onClickCloseDeleteRowModal,
    onDeleteCategory,
    selectedCategory,
    openDeleteTableRowModal,
    onClickCloseDeleteTableRowModal,
    onDeleteCategoryRow,
    onClickCloseDeleteTableRowWhenHaveMoreSupplierModal,
    openDeleteTableRowWhenHaveMoreSupplierModal,
    selectedTableRow,
    materialName,
    toggleIsActive,
    selectedMaterialCategory,
    setSelectedMaterialCategory,
    uploadExcelFile,
    elementRef,
    onChangeRowCheckBox,
    onClickOpenDeleteTableRowModal,
    onClickOpenDeleteTableRowWhenHaveMoreSupplierModal,
  } = useMaterials(props.isAdmin);
  const subCategory = materialCategories.find(
    (category) => category.categoryKey === materialCategory?.toString()
  )?.categoryName;

  const materialsSteps: StepType[] = [
    {
      selector: '[data-tour="materialsCategories"]',
      content:
        "Here, you can navigate between sheet types and add new types as needed.",
      position: "right",
    },
    {
      selector: '[data-tour="materialsActions"]',
      content:
        "Click on the menu to discover all options: Edit price, Update all selected prices by percentage, Change currency, Add and duplicate new, and more",
      position: "left",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1 }),
      },
    },
    {
      selector: '[data-tour="menuMachines"]',
      content:
        'Take your time to explore and discover all materials later. Now, let\'s proceed to view the list of machines.\n Please press "Machines" in the bar.',
      position: "left",
      styles: {
        maskWrapper: (base) => ({ ...base, zIndex: 1000000 }),
      },
    },
  ];

  const { } = useGoMakeTour(materialsSteps, []);

  const Side = () => (
    <Stack direction={"column"} gap={"10px"}>
      <SideList
        data-tour={"materialsCategories"}
        list={materialsCategoriesList()}
        selectedItem={materialCategory?.toString()}
        onSelect={(categoryId) => {
          onSelectCategory(categoryId);
          setIsSidebarOpen(false);
        }}
        title={t("materials.chooseCategory")}
        isHaveDeleteIcon={true}
      >
        <Stack style={classes.buttonsContainerStyle}>
          <PrimaryButton
            onClick={() => {
              changeEditCategoryModalState(false);
              changeDuplicateCategoryModalState(false);
              setOpenAddCategoryModal(true);
            }}
            variant={"contained"}
          >
            {t("materials.buttons.addNew")}
          </PrimaryButton>
        </Stack>
      </SideList>
    </Stack>
  );

  useEffect(() => {
    if (materialType && materialCategories.length > 0) {
      if (
        !materialCategory ||
        !materialCategories.some(
          (category) => category.categoryKey === materialCategory
        )
      ) {
        const defaultCategory = materialCategories[0].categoryKey;

        replace({
          pathname: materialType.toString(),
          query: { materialCategory: defaultCategory },
        });

        setSelectedMaterialCategory(defaultCategory);
        // onSelectCategory(defaultCategory); //  is setSelectedMaterialCategory sufficient to update or need onSelectCategory
      }
    }
  }, [materialCategories]);

  useEffect(() => {
    getCurrenciesApi().then();
    getMachinesMaterials();
    getClientsMaterials();
  }, [pageNumber]);

  useEffect(() => {
    getMaterialCategories(materialType).then();
    getMaterialTableHeaders(materialType?.toString()).then();
  }, [materialType]);
  useEffect(() => {
    getPrintHouseMaterialCategorySuppliers(
      materialType?.toString(),
      materialCategory?.toString()
    ).then();
  }, [materialCategory]);
  const isLoadingMaterials = useRecoilValue(isLoadingMaterialsState);
  useEffect(() => {
    if (!!materialType && !!materialCategory) {
      if (props.isAdmin) {
        getMaterialCategoryData(
          materialType?.toString(),
          materialCategory?.toString(),
          materialFilter,
          supplierId,
          pageNumber,
          pageSize
        ).then();
      } else {
        if (supplierId) {
          getMaterialCategoryData(
            materialType?.toString(),
            materialCategory?.toString(),
            materialFilter,
            supplierId,
            pageNumber,
            pageSize
          ).then();
        }
      }
    }
  }, [
    materialType,
    materialCategory,
    supplierId,
    pageNumber,
    pageSize,
    activeFilter,
    materialFilter,
  ]);
  return (
    <div>
      <div style={classes.headerStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 5,
          }}
        >
          <PrimaryButton
            variant={"text"}
            href={props.isAdmin ? "/materials-admin" : "/materials"}
            startIcon={dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            style={classes.backButtonStyle}
          >
            {t("materials.buttons.back")}
          </PrimaryButton>
          <h1 style={classes.header}>{materialName}</h1>
          <h4 style={classes.subHeader}>/ {subCategory}</h4>
          <IconButton
            size="small"
            onClick={() => setIsSidebarOpen(true)}
            sx={{
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#e3f2fd'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
        <FiltersActionsBar isAdmin={props.isAdmin} subCategory={subCategory} />
      </div>
      {/* Absolute positioned sidebar overlay */}
      {isSidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 115,
            left: 140,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1300,
            display: 'flex'
          }}
          onClick={() => setIsSidebarOpen(false)}
        >
          <Box
            sx={{
              width: '500px',
              backgroundColor: '#fff',
              height: '100%',
              overflow: 'auto',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {Side()}
          </Box>
        </Box>
      )}

      {/* Full width content */}
      <div style={{ width: '100%', padding: '0 20px' }}>
        {
          isLoadingMaterials ?
            <div style={{ height: 795, width: "100%" }}>
              <Skeleton variant="rectangular" height={795} width="100%" />
            </div> : <>
              {materialCategory && (
                <Stack
                  justifyContent={"space-between"}
                  gap={2}
                  display={"flex"}
                  height={"100%"}
                >
                  <div>
                    {materialCategoryData.length > 0 ? (
                      <CombinedTable
                        headers={tableHeadersNew()}
                        rows={tableRowsNew}
                        isAdmin={props.isAdmin}
                        onChangeRowCheckBox={onChangeRowCheckBox}
                        onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
                        onClickOpenDeleteTableRowWhenHaveMoreSupplierModal={onClickOpenDeleteTableRowWhenHaveMoreSupplierModal}
                        toggleIsActive={toggleIsActive}
                      />
                    ) : flag &&
                      materialCategories.find(
                        (category) => category.categoryKey === materialCategory
                      ).isDeletable ? (
                      <CombinedTable
                        headers={tableHeadersNew()}
                        rows={tableRowsNew}
                        isAdmin={props.isAdmin}
                        onChangeRowCheckBox={onChangeRowCheckBox}
                        onClickOpenDeleteTableRowModal={onClickOpenDeleteTableRowModal}
                        onClickOpenDeleteTableRowWhenHaveMoreSupplierModal={onClickOpenDeleteTableRowWhenHaveMoreSupplierModal}
                        toggleIsActive={toggleIsActive}
                      />
                    ) : !props.isAdmin ? (
                      <div style={classes.noData}>
                        {
                          activeFilter === EMaterialActiveFilter.INACTIVE ? <h4>
                            {t("materials.sheetPaper.thereNoInactiveDataFor")} {materialCategory}
                          </h4> :
                            <h4>
                              {t("materials.sheetPaper.noDataFor")} {materialCategory}
                            </h4>
                        }

                        <br />
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                          <GomakePrimaryButton
                            style={classes.noDataButton} onClick={() => {
                              setOpenAddRowModal(true);
                            }}>
                            {t("materials.sheetPaper.addRowMaterial")}
                          </GomakePrimaryButton>
                          <GomakePrimaryButton style={classes.noDataButton} onClick={() => {
                            elementRef.current.click();
                          }}>
                            {t("materials.sheetPaper.uploadForExcel")}
                          </GomakePrimaryButton>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div style={{ marginBottom: "5px" }}>
                    <Pagination
                      count={pagesCount}
                      variant="outlined"
                      color="primary"
                      page={pageNumber}
                      onChange={(event, value) => setPageNumber(value)}
                    />
                  </div>
                </Stack>
              )}
            </>
        }
      </div>
      <AddSupplierModal />
      <AddCategoryModal isAdmin={props.isAdmin} />
      <AddRowModal isAdmin={props.isAdmin} />
      <UpdatedNumburingModal isAdmin={props.isAdmin} />
      <CreatePurchaseOrderModal isAdmin={props.isAdmin} />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={() => onDeleteCategory(selectedCategory?.categoryKey)}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        onClickDelete={() => onDeleteCategoryRow(selectedTableRow?.id)}
      />
      <ThreeOptionsModal
        hideIcon
        title={t("materials.modals.deleteModalTitle")}
        yesBtn={t("navigationButtons.delete")}
        noBtn={
          selectedTableRow?.isActive
            ? t("remainWords.convertToInactive")
            : t("remainWords.convertToActive")
        }
        openModal={openDeleteTableRowWhenHaveMoreSupplierModal}
        onClose={onClickCloseDeleteTableRowWhenHaveMoreSupplierModal}
        onClickYes={() => onDeleteCategoryRow(selectedTableRow?.id)}
        onClickNo={() =>
          toggleIsActive(
            selectedTableRow?.id,
            "Active",
            selectedTableRow?.isActive
          )
        }
      />
      {/* <GoMakeDeleteModal
        openModal={openPriceModal}
        onClose={onClickClosePriceModal}
        hideIcon
        modalType={ModalType.EDIT}
        title={t("materials.modals.editPriceModalTitle")}
        subTitle={t("materials.modals.editPriceModalSubTitle")}
        yesBtn={t("materials.modals.editPriceModalYesBtn")}
        cancelBtn={t("materials.modals.editPriceModalCancelBtn")}
        onClickDelete={async () => {
          updateProfitProfileProductHidden(true)
        }}
        onClickCancel={async () => {
          updateProfitProfileProductHidden(false)
        }}
      /> */}
      <input
        ref={elementRef}
        onChange={uploadExcelFile}
        type="file"
        accept=".xlsx"
        hidden={true}
      />
    </div>
  );
};

export { MaterialsWidget };
