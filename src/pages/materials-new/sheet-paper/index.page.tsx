import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-sheet-paper";
import { HeaderFilter } from "./header-filter";
import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { useEffect, useState } from "react";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { Header, Row } from "@/widgets/table/components";
import { Checkbox, Switch } from "@mui/material";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export default function SheetPaper() {
  const [selectedMaterials, setSelectedMaterials] = useState<any>("");
  const { t } = useTranslation();
  const {
    onChangeCategory,
    onChangeSupplier,
    setAllWeights,
    getSheetAllWeights,
    sheetCategories,
    categoryName,
    allWeights,
    allWeightsGrouped,
    headerTable,
  } = useSheetPaper();
  useEffect(() => {
    if (sheetCategories.length) {
      setSelectedMaterials(sheetCategories[0]);
    }
  }, [sheetCategories]);
  useEffect(() => {
    console.log("CALL API TO GET DATA");
    getSheetAllWeights(selectedMaterials);
  }, [selectedMaterials]);
  useEffect(() => {
    console.log("allWeightsGrouped", allWeightsGrouped);
  }, [allWeightsGrouped]);
  const Side = () => (
    <SideList
      list={sheetCategories}
      selectedItem={selectedMaterials}
      onSelect={setSelectedMaterials}
      title={"Choose Category"}
    >
      {/* <GomakePrimaryButton disabled={!selectedMaterials} style={{ height: 40 }}>
        Add New Category
      </GomakePrimaryButton> */}
    </SideList>
  );
  const { clasess } = useStyle();
  const tableHeaders = [
    "c",
    "Weight",
    "Size",
    "Thickness",
    "cost ($) per unit/ton",
    "Directions",
    "Active",
    "Currency",
    "Stock",
    // "Delete",
  ];
  const tableWidth = [
    "5%",
    "10%",
    "10%",
    "10%",
    "20%",
    "15%",
    "10%",
    "10%",
    "10%",
    // "5%",
  ];
  const { primaryColor } = useGomakeTheme();

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const onClickAddNewSupplier = () => {
    setShowSupplierModal(true);
  };
  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={t("materials.sheetPaper.title")} side={Side()}>
        <div style={clasess.header}>
          {tableHeaders.map((header: string, index: number) => {
            return index === 0 ? (
              <Checkbox />
            ) : (
              <Header
                key={`header_item${index}`}
                header={header}
                index={index}
                width={tableWidth[index]}
              />
            );
          })}
        </div>
        <div style={{ paddingLeft: 0 }}>
          {allWeightsGrouped.length === 0 && (
            <div style={clasess.noData}>
              There is supplier added to this sheet yet,
              <span style={clasess.noDataSpan} onClick={onClickAddNewSupplier}>
                {" "}
                Please add new one now.
              </span>
            </div>
          )}
          {allWeightsGrouped?.map((row: any, index: number) => {
            return (
              <div style={{ ...clasess.bodyRow, borderBottom: "1px solid" }}>
                <div
                  style={{
                    width: "5%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Checkbox />
                </div>
                <div
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: -5,
                    ...FONT_FAMILY.Lexend(500, 14),
                  }}
                >
                  {row.weight}
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    ...FONT_FAMILY.Lexend(500, 14),
                    color: primaryColor(500),
                  }}
                >
                  {row?.sheetSizes.length &&
                    row?.sheetSizes?.map((size: any, index2: number) => {
                      return (
                        <div
                          style={
                            index2 % 2 == 0
                              ? clasess.bodyRow
                              : clasess.secondRow
                          }
                        >
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingLeft: 20,
                            }}
                          >
                            {size?.name}
                          </div>
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {size?.thickness}
                          </div>
                          <div
                            style={{
                              width: "20%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {size?.pricePerUnit}/{size?.pricePerTon}
                          </div>
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingLeft: 40,
                            }}
                          >
                            {size?.direction}
                          </div>
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingLeft: 30,
                            }}
                          >
                            <Switch checked={row?.isActive} />
                          </div>
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {size?.currency}
                          </div>
                          <div
                            style={{
                              width: "13%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {size?.stock}
                          </div>
                          <div
                            style={{
                              width: "5%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <DeleteIcon
                              height={20}
                              width={20}
                              color={clasess.iconColor}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
        {/* <HeaderFilter
          setAllWeights={setAllWeights}
          allWeights={allWeights}
          sheetCategories={sheetCategories}
          categoryName={categoryName}
          onChangeCategory={onChangeCategory}
          onChangeSupplier={onChangeSupplier}
        /> */}
        {/* <Table tableHeaders={headerTable} tableRows={allWeightsGrouped} /> */}

        <GoMakeModal
          openModal={showSupplierModal}
          modalTitle={`Add Supplier`}
          onClose={() => setShowSupplierModal(false)}
          insideStyle={clasess.insideStyle}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            Hey
          </div>
        </GoMakeModal>
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
