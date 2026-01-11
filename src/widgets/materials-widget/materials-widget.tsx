import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { useMaterials } from "@/widgets/materials-widget/use-materials";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/materials-widget/style";
import { FiltersActionsBar } from "@/widgets/materials-widget/components/filters/filters-actions-bar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  flagState,
  isDuplicateCategoryModalState,
  isEditCategoryModalState,
  openAddCategoryModalState,
  openAddRowModalState,
  selectedSupplierIdState,
  selectedSuppliersIdsState,
} from "@/widgets/materials-widget/state";
import { navStatusState } from "@/store/nav-status";
import { AddSupplierModal } from "@/widgets/materials-widget/components/add-supplier/add-supplier-modal";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AddCategoryModal } from "./components/add-category/add-category-modal";
import { AddRowModal } from "./components/add-row/add-row-modal";
import { useMaterialsCategories } from "./use-materials-categories";
import {
  GoMakeDeleteModal,
  GomakePrimaryButton,
  ThreeOptionsModal,
} from "@/components";
import { Skeleton, Stack, Box, IconButton } from "@mui/material";
import { UpdatedNumburingModal } from "./components/updated-numbering/updated-numbering-modal";
import { CreatePurchaseOrderModal } from "./components/create-purchase-order-modal/create-purchase-order-modal";
import { ModalType } from "@/enums";
import { isLoadingMaterialsState } from "@/store";
import { EMaterialActiveFilter } from "./enums";
import { CombinedTable } from "./components/combined-table/combined-table";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import {
  getAndSetAllCustomers,
  getAndSetRecentCustomers,
} from "@/services/hooks/cart-side/customers";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useDebouncedCallback } from "use-debounce";
import { ExtraParametersModal } from "./components/extra-parameters-modal/extra-parameters-modal";
import { DuplicatesModal } from "./components/duplicates-modal";
interface IMaterialsWidgetProps {
  isAdmin: boolean;
}
const MaterialsWidget = (props: IMaterialsWidgetProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const dir: "rtl" | "ltr" = t("direction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [filterBarHeight, setFilterBarHeight] = useState(40); // Default single-line height
  const { getMaterialCategoryData } = useMaterialsCategories(props.isAdmin);
  const activeFilter = useRecoilValue(activeFilterState);
  const navStatus = useRecoilValue(navStatusState);
  const sidebarOffset = navStatus.isClosed ? 135 : 270;
  const setOpenAddRowModal = useSetRecoilState(openAddRowModalState);
  const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
  const changeEditCategoryModalState = useSetRecoilState(
    isEditCategoryModalState
  );
  const changeDuplicateCategoryModalState = useSetRecoilState(
    isDuplicateCategoryModalState
  );
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const suppliersIds = useRecoilValue(selectedSuppliersIdsState);
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
    setSelectedMaterialCategory,
    uploadExcelFile,
    elementRef,
    openDuplicatesModal,
    duplicatesData,
    handleDeleteSelectedMaterials,
    handleCloseDuplicatesModal,
    handleRefreshMaterialData,
    materialHeaders,
  } = useMaterials(props.isAdmin);

  const {
    loadMoreData,
    hasMoreData,
    isLoadingMore,
    setPageNumber: resetPageNumber,
  } = useMaterialsCategories(props.isAdmin);

  const subCategory = materialCategories.find(
    (category) => category.categoryKey === materialCategory?.toString()
  )?.categoryName;


  const handleFilterHeightChange = useCallback((height: number) => {
    setFilterBarHeight(height);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (materialType && materialCategory && !isLoadingMore && hasMoreData) {
      loadMoreData(
        materialType.toString(),
        materialCategory.toString(),
        materialFilter,
        supplierId,
        20 // pageSize
      );
    }
  }, [
    materialType,
    materialCategory,
    materialFilter,
    supplierId,
    isLoadingMore,
    hasMoreData,
    loadMoreData,
  ]);

  useEffect(() => {
    if (!subCategory) {
      // Wait 2 seconds before opening sidebar if no category selected
      const timer = setTimeout(() => {
        setIsSidebarOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsSidebarOpen(false);
    }
  }, [subCategory]);

  const { callApi } = useGomakeAxios();
  const [listClient, setListClient] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [isFetchingSupplier, setIsFetchingSupplier] = useState(false);

  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
  const debouncedGetAllClients = useDebouncedCallback((value: string) => {
    getAllClients(value);
  }, 1200);

  const debouncedGetAllSuppliers = useDebouncedCallback((value: string) => {
    getAllSuppliers(value);
  }, 1200);

  const getAllClients = useCallback(async (SearchTerm?: string) => {
    if (SearchTerm) {
      setIsFetchingCustomer(true);
    }
    await getAndSetAllCustomers(callApi, setListClient, {
      clientType: CLIENT_TYPE.CUSTOMER,
      searchTerm: SearchTerm as string,
    });
    setIsFetchingCustomer(false);
  }, []);

  const getAllSuppliers = useCallback(async (SearchTerm?: string) => {
    if (SearchTerm) {
      setIsFetchingSupplier(true);
    }
    await getAndSetAllCustomers(callApi, setListSupplier, {
      clientType: CLIENT_TYPE.SUPPLIER,
      searchTerm: SearchTerm as string,
    });
    setIsFetchingSupplier(false);
  }, []);

  const checkWhatRenderArrayCustomer = (e: any) => {
    const value = e.target.value.trim();
    if (value === "") {
      debouncedGetAllClients.cancel();
      getRecentClients();
    } else {
      debouncedGetAllClients(value);
    }
  };

  const checkWhatRenderArraySupplier = (e: any) => {
    const value = e.target.value.trim();
    if (value === "") {
      debouncedGetAllSuppliers.cancel();
      getRecentSuppliers();
    } else {
      debouncedGetAllSuppliers(value);
    }
  };

  const getRecentClients = useCallback(async () => {
    await getAndSetRecentCustomers(callApi, setListClient, {
      ClientType: CLIENT_TYPE.CUSTOMER,
    });
  }, []);

  const getRecentSuppliers = useCallback(async () => {
    await getAndSetRecentCustomers(callApi, setListSupplier, {
      ClientType: CLIENT_TYPE.SUPPLIER,
    });
  }, []);

  useEffect(() => {
    getRecentClients();
    getRecentSuppliers();
  }, []);

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
        onClickCloseSidebar={() => setIsSidebarOpen(false)}
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
    getCurrenciesApi().then();
    getMachinesMaterials();
    getClientsMaterials();
  }, []);

  useEffect(() => {
    getMaterialCategories(materialType).then();
    getMaterialTableHeaders(materialType?.toString()).then();
  }, [materialType]);

  const isLoadingMaterials = useRecoilValue(isLoadingMaterialsState);

  useEffect(() => {
    if (!!materialType && !!materialCategory) {
      // Reset to page 1 when filters change
      resetPageNumber(1);

      getMaterialCategoryData(
        materialType?.toString(),
        materialCategory?.toString(),
        materialFilter,
        supplierId,
        1, // pageNumber
        20 // pageSize
      ).then();
    }
  }, [
    materialType,
    materialCategory,
    suppliersIds,
    activeFilter,
    materialFilter,
  ]);
  return (
    <>
      {!!materialName && (
        <div style={{ overflow: "hidden" }}>
          <PrimaryButton
            variant={"text"}
            href={props.isAdmin ? "/materials-admin" : "/materials"}
            startIcon={dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            style={classes.backButtonStyle}
          >
            {t("materials.buttons.back")}
          </PrimaryButton>
          <div style={classes.headerStyle}>
            <div
              onClick={() => setIsSidebarOpen(true)}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 5,
                width: "30%",
              }}
            >
              <h1 style={classes.header}>{materialName}</h1>
              <h4 style={classes.subHeader}>
                / {subCategory ?? t("materials.chooseCategory")}
              </h4>
              <IconButton
                size="small"
                // onClick={() => setIsSidebarOpen(true)}
                sx={{
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <KeyboardArrowDownIcon
                  fontSize="medium"
                  sx={{ color: "#5759A8", marginTop: "3px" }}
                />
                {/* <EditIcon fontSize="small" /> */}
              </IconButton>
            </div>
            <div
              style={{
                width: "70%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <FiltersActionsBar
                isAdmin={props.isAdmin}
                subCategory={subCategory}
                isFetchingSupplier={isFetchingSupplier}
                renderOptionsSupplier={listSupplier}
                checkWhatRenderArraySupplier={checkWhatRenderArraySupplier}
                onHeightChange={handleFilterHeightChange}
              />
            </div>
          </div>
          {/* Absolute positioned sidebar overlay */}
          {isSidebarOpen && (
            <Box
              sx={{
                position: "fixed",
                top: 120,
                [dir === "rtl" ? "right" : "left"]: sidebarOffset,
                [dir !== "rtl" ? "right" : "left"]: 0,
                // left: 140,
                // right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 1300,
              }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  [dir === "rtl" ? "right" : "left"]: "0px",
                  width: "380px",
                  backgroundColor: "#fff",
                  height: "100%",
                  overflow: "auto",
                  boxShadow:
                    dir === "rtl"
                      ? "-2px 0 8px rgba(0,0,0,0.1)"
                      : "2px 0 8px rgba(0,0,0,0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {Side()}
              </Box>
            </Box>
          )}

          {/* Full width content */}
          <div style={{ width: "100%", padding: "10px 10px" }}>
            {isLoadingMaterials ? (
              <div style={{ height: 795, width: "100%" }}>
                <Skeleton variant="rectangular" height={795} width="100%" />
              </div>
            ) : (
              <>
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
                          materialType={materialType?.toString()}
                          materialCategory={materialCategory?.toString()}
                          renderOptionsCustomer={listClient}
                          checkWhatRenderArrayCustomer={
                            checkWhatRenderArrayCustomer
                          }
                          isFetchingCustomer={isFetchingCustomer}
                          renderOptionsSupplier={listSupplier}
                          checkWhatRenderArraySupplier={
                            checkWhatRenderArraySupplier
                          }
                          isFetchingSupplier={isFetchingSupplier}
                          onLoadMore={handleLoadMore}
                          hasMoreData={hasMoreData}
                          isLoadingMore={isLoadingMore}
                          filterBarHeight={filterBarHeight}
                          isAdmin={props.isAdmin}
                        />
                      ) : flag &&
                        materialCategories.find(
                          (category) =>
                            category.categoryKey === materialCategory
                        ).isDeletable ? (
                        <CombinedTable
                          headers={tableHeadersNew()}
                          rows={tableRowsNew}
                          materialType={materialType?.toString()}
                          materialCategory={materialCategory?.toString()}
                          renderOptionsCustomer={listClient}
                          checkWhatRenderArrayCustomer={
                            checkWhatRenderArrayCustomer
                          }
                          isFetchingCustomer={isFetchingCustomer}
                          renderOptionsSupplier={listSupplier}
                          checkWhatRenderArraySupplier={
                            checkWhatRenderArraySupplier
                          }
                          isFetchingSupplier={isFetchingSupplier}
                          onLoadMore={handleLoadMore}
                          hasMoreData={hasMoreData}
                          isLoadingMore={isLoadingMore}
                          filterBarHeight={filterBarHeight}
                        />
                      ) : !props.isAdmin ? (
                        <div style={classes.noData}>
                          {activeFilter === EMaterialActiveFilter.INACTIVE ? (
                            <h4>
                              {t("materials.sheetPaper.thereNoInactiveDataFor")}{" "}
                              {materialCategory}
                            </h4>
                          ) : (
                            <h4>
                              {subCategory ?
                                <>
                                  {t("materials.sheetPaper.noDataFor")}{" "}
                                  {subCategory ?? ""}
                                </> :
                                <>
                                  {t("materials.sheetPaper.noData2")}
                                </>
                              }
                            </h4>
                          )}

                          <br />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <GomakePrimaryButton
                              style={classes.noDataButton}
                              onClick={() => {
                                setOpenAddRowModal(true);
                              }}
                            >
                              {t("materials.sheetPaper.addRowMaterial")}
                            </GomakePrimaryButton>
                            <GomakePrimaryButton
                              style={classes.noDataButton}
                              onClick={() => {
                                elementRef.current.click();
                              }}
                            >
                              {t("materials.sheetPaper.uploadForExcel")}
                            </GomakePrimaryButton>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Stack>
                )}
              </>
            )}
          </div>
          <AddSupplierModal />
          <AddCategoryModal isAdmin={props.isAdmin} />
          <AddRowModal isAdmin={props.isAdmin} />
          <UpdatedNumburingModal isAdmin={props.isAdmin} />
          <CreatePurchaseOrderModal isAdmin={props.isAdmin} />
          <ExtraParametersModal isAdmin={props.isAdmin} />
          <GoMakeDeleteModal
            modalType={ModalType.DELETE}
            openModal={openDeleteRowModal}
            onClose={onClickCloseDeleteRowModal}
            onClickDelete={() =>
              onDeleteCategory(selectedCategory?.categoryKey)
            }
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
          <input
            key={fileInputKey}
            ref={elementRef}
            onChange={(e) => {
              uploadExcelFile(e);
              setFileInputKey(Date.now());
            }}
            type="file"
            accept=".xlsx"
            hidden={true}
          />

          {/* Duplicates/Deleted Materials Modal */}
          <DuplicatesModal
            openModal={openDuplicatesModal}
            onClose={handleCloseDuplicatesModal}
            data={duplicatesData}
            onDelete={handleDeleteSelectedMaterials}
            materialHeaders={materialHeaders}
            onRefreshData={handleRefreshMaterialData}
          />
        </div>
      )}
    </>
  );
};

export { MaterialsWidget };
