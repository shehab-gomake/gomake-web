import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useMaterials } from "@/widgets/materials-widget/use-materials";
import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/materials-widget/style";
import { FiltersActionsBar } from "@/widgets/materials-widget/components/filters/filters-actions-bar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  flagState,
  openAddCategoryModalState,
  openAddSupplierModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { AddSupplierModal } from "@/widgets/materials-widget/components/add-supplier/add-supplier-modal";
import { PrimaryButton } from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AddCategoryModal } from "./components/add-category/add-category-modal";
import { AddRowModal } from "./components/add-row/add-row-modal";
import { useMaterialsCategories } from "./use-materials-categories";
import Pagination from "@mui/material/Pagination";
import { GoMakeDeleteModal } from "@/components";
interface IMaterialsWidgetProps {
  isAdmin: boolean;
}
const MaterialsWidget = (props: IMaterialsWidgetProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const dir: "rtl" | "ltr" = t("direction");
  const { getMaterialCategoryData, pagesCount, pageNumber, setPageNumber } =
    useMaterialsCategories(props.isAdmin);
  const pageSize = 12;
  const activeFilter = useRecoilValue(activeFilterState);
  const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
  const setOpenAddCategoryModal = useSetRecoilState(openAddCategoryModalState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const flag = useRecoilValue(flagState);

  const {
    materialCategory,
    materialType,
    materialsCategoriesList,
    onSelectCategory,
    tableRows,
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
    selectedTableRow,
    materialName,
  } = useMaterials(props.isAdmin);

  const subCategory = materialCategories.find(
    (category) => category.categoryKey === materialCategory?.toString()
  )?.categoryName;

  const tableRowData = tableRowsNew;

  const Side = () => (
    <Stack direction={"column"} gap={"10px"}>
      <SideList
        list={materialsCategoriesList()}
        selectedItem={materialCategory?.toString()}
        onSelect={onSelectCategory}
        title={"choose category"}
        isHaveDeleteIcon={true}
      >
        <Stack style={classes.buttonsContainerStyle}>
          <PrimaryButton
            onClick={() => setOpenAddCategoryModal(true)}
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
        replace({
          pathname: materialType.toString(),
          query: { materialCategory: materialCategories[0].categoryKey },
        });
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
        } else {
          getPrintHouseMaterialCategorySuppliers(
            materialType?.toString(),
            materialCategory?.toString()
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
        </div>
        <FiltersActionsBar isAdmin={props.isAdmin} />
      </div>
      <SideBarContainer side={Side()} subHeader={""}>
        {materialCategory && (
          <Stack gap={2}>
            <div style={{ minHeight: "70vh" }}>
              {materialCategoryData.length > 0 ? (
                <Stack display={"grid"}>
                  <PrimaryTable
                    rows={tableRowData}
                    headers={tableHeadersNew()}
                  />
                </Stack>
              ) : flag &&
                materialCategories.find(
                  (category) => category.categoryKey === materialCategory
                ) ? (
                <Stack display={"grid"}>
                  <PrimaryTable
                    rows={tableRowsNew}
                    headers={tableHeadersNew()}
                  />
                </Stack>
              ) : (
                <div style={classes.noData}>
                  {t("materials.sheetPaper.supplierAddedSheetYet")}
                  <span
                    style={classes.noDataSpan}
                    onClick={() => {
                      setOpenAddSupplierModal(true);
                    }}
                  >
                    {t("materials.sheetPaper.pleaseAddNow")}
                  </span>
                </div>
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
      </SideBarContainer>
      <AddSupplierModal />
      <AddCategoryModal isAdmin={props.isAdmin} />
      <AddRowModal isAdmin={props.isAdmin} />
      <GoMakeDeleteModal
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={() => onDeleteCategory(selectedCategory?.categoryKey)}
      />
      <GoMakeDeleteModal
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        onClickDelete={() => onDeleteCategoryRow(selectedTableRow?.id)}
      />
    </div>
  );
};

export { MaterialsWidget };
