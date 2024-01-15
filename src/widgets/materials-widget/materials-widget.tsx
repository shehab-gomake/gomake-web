import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useMaterials } from "@/widgets/materials-widget/use-materials";
import React, { useEffect, useRef, useState } from "react";
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
import { SecondaryButton } from "@/components/button/secondary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AddCategoryModal } from "./components/add-category/add-category-modal";
import { AddRowModal } from "./components/add-row/add-row-modal";
import { useMaterialsCategories } from "./use-materials-categories";
import Pagination from "@mui/material/Pagination";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
interface IMaterialsWidgetProps{
  isAdmin:boolean;
}
const MaterialsWidget = (props:IMaterialsWidgetProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const dir: "rtl" | "ltr" = t("direction");
  const { 
    getMaterialCategoryData, 
    pagesCount, 
    pageNumber,
    setPageNumber } = useMaterialsCategories(props.isAdmin);
  const pageSize = DEFAULT_VALUES.PageSize;
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
    tableHeaders,
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
    materialFilter,
  } = useMaterials(props.isAdmin);

  const tableRowData = materialCategories.find(
    (category) => category.categoryKey === materialCategory
  )?.isAddedByPrintHouse
    ? tableRowsNew
    : tableRows;

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
  }, [pageNumber]);

  useEffect(() => {
    getMaterialCategories(materialType).then();
    getMaterialTableHeaders(materialType?.toString()).then();
  }, [materialType]);

  useEffect(() => {
    if (!!materialType && !!materialCategory) {
      if(props.isAdmin){
        getMaterialCategoryData(
            materialType?.toString(),
            materialCategory?.toString(),
            materialFilter,
            supplierId,
            pageNumber,
            pageSize
        ).then();
      }else{
        if (supplierId ) {
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
    materialFilter
  ]);
  return (
    <div style={classes.mainContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingRight: 12,
        }}
      >
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
            href={props.isAdmin ? "/materials-admin" :"/materials"}
            startIcon={dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
            style={{
              height: 30,
              marginRight: 5,
              background: "#CBCBE5",
              width: 90,
              borderRadius: 8,
            }}
          >
            {t("materials.buttons.back")}
          </PrimaryButton>
          <h1 style={classes.header}>{materialType?.toString()}</h1>
          <h4 style={classes.subHeader}>/ {materialCategory?.toString()}</h4>
        </div>
        <FiltersActionsBar isAdmin={props.isAdmin} />
      </div>
      <SideBarContainer side={Side()} subHeader={""}>
        {materialCategory && (
          <Stack gap={2}>
            <div style={{ minHeight: 550 }}>
              {materialCategoryData.length > 0 ? (
                <div style={{ paddingBottom: "1%" }}>
                  <PrimaryTable
                    rows={tableRowData}
                    headers={tableHeadersNew()}
                  />
                </div>
              ) : flag &&
                materialCategories.find(
                  (category) => category.categoryKey === materialCategory
                )?.isAddedByPrintHouse ? (
                <PrimaryTable rows={tableRowsNew} headers={tableHeadersNew()} />
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
    </div>
  );
};

export { MaterialsWidget };
