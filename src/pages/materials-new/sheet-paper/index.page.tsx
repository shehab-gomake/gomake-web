import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-sheet-paper";
import { HeaderFilter } from "./header-filter";
import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { useEffect, useState } from "react";
import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { Header, Row } from "@/widgets/table/components";

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
    "Thiknes",
    "cost ($) per unit/ton",
    "Directions",
    "Active",
    "Currency",
    "Stock",
    "D",
  ];
  const tableWidth = [
    "5%",
    "10%",
    "10%",
    "10%",
    "20%",
    "10%",
    "10%",
    "10%",
    "10%",
    "5%",
  ];
  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={t("materials.sheetPaper.title")} side={Side()}>
        <div style={clasess.header}>
          {tableHeaders.map((header: string, index: number) => {
            return (
              <Header
                key={`header_item${index}`}
                header={header}
                index={index}
                width={tableWidth[index]}
              />
            );
          })}
        </div>
        <div style={{ paddingLeft: 5 }}>
          {allWeightsGrouped?.map((row: any, index: number) => {
            return (
              <div style={clasess.bodyRow}>
                <div
                  style={{
                    width: "5%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  c
                </div>
                <div
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {row.weight}
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                          <div style={{ width: "13%" }}>{size?.name}</div>
                          <div style={{ width: "13%" }}>{size?.thickness}</div>
                          <div style={{ width: "20%" }}>
                            {size?.pricePerUnit}/{size?.pricePerTon}
                          </div>
                          <div style={{ width: "13%" }}>{size?.direction}</div>
                          <div style={{ width: "13%" }}>
                            {row?.isActive ? "YES" : "NO"}
                          </div>
                          <div style={{ width: "13%" }}>{size?.currency}</div>
                          <div style={{ width: "13%" }}>{size?.stock}</div>
                          <div style={{ width: "5%" }}>a</div>
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
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
