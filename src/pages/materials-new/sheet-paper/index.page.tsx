import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";

import { useSheetPaper } from "./use-sheet-paper";
import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { Checkbox, IconButton, Switch } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { SettingsIcon } from "@/icons/settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useCallback, useEffect, useState } from "react";
import { SecondSwitch } from "@/components/switch/second";
import { UpdatePricePerTonModal } from "./modals/update-price-per-ton-modal";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { SheetCheckBox } from "./checkbox";
import { sheetCheckAllState } from "./store/sheet-check-all";
import { useRecoilState } from "recoil";
import { UpdateCurrencyModal } from "./modals/update-currency-modal";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { clasess } = useStyle();

  const { primaryColor } = useGomakeTheme();
  const {
    sheetCategories,
    categoryName,
    allWeightsGrouped,
    selectedMaterials,
    selectedSupplier,
    sheetStore,
    suppliers,
    showSupplierModal,
    tableHeaders,
    tableWidth,
    setSelectedMaterials,
    setSelectedSupplier,
    getSheetAllWeights,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,
  } = useSheetPaper();
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
  const [actionType, setActionType] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isUpdatePricePerTon, setIsUpdatePricePerTon] = useState(false);
  const [isUpdateCurrency, setIsUpdateCurrency] = useState(false);
  const onCloseUpdateCurrency = () => {
    setIsUpdateCurrency(false);
  };
  const onOpenUpdateCurrency = () => {
    setIsUpdateCurrency(true);
    setActionType(5);
    handleClose();
  };
  const onCloseUpdatePricePerTon = () => {
    setIsUpdatePricePerTon(false);
  };
  const onOpenUpdatePricePerTon = () => {
    setIsUpdatePricePerTon(true);
    setActionType(0);
    handleClose();
  };
  const onOpenUpdateUnitPrice = () => {
    setIsUpdatePricePerTon(true);
    setActionType(1);
    handleClose();
  };
  const onOpenAddPercentToPrice = () => {
    setIsUpdatePricePerTon(true);
    setActionType(2);
    handleClose();
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (weightId, sizeId, isChecked) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { weightId, sizeId },
      ]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter(
          (item) => !(item.weightId === weightId && item.sizeId === sizeId)
        )
      );
    }
  };
  const [data, setData] = useState();
  useEffect(() => {
    const updatedData: any = selectedItems.map((item) => {
      return {
        ...item,
        data,
      };
    });
    setSelectedItems(updatedData);
  }, [data]);
  const updatePricePetTon = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: actionType,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      onCloseUpdatePricePerTon();
      onCloseUpdateCurrency();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: 3,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const updateToInActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: 4,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const renderHeader = useCallback(() => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div style={clasess.title}>{selectedMaterials}</div>
        <div
          style={{
            width: "40%",
            display: "flex",
            alignItems: "center",
          }}
          key={selectedMaterials}
        >
          {sheetStore?.suppliers.length > 0 && (
            <GoMakeAutoComplate
              style={{ width: "100%" }}
              options={sheetStore?.suppliers}
              placeholder={"Select Supplier"}
              renderOption={(props, option: any) => {
                if (option.label === "Add new") {
                  return (
                    <div
                      onClick={onClickAddNewSupplier}
                      style={clasess.addSupplierAutoComplate}
                    >
                      Add new Supplier
                    </div>
                  );
                }
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div {...props} style={{ width: "100%" }}>
                      {option.label}{" "}
                    </div>
                    <div>
                      <SecondSwitch
                        checked={option?.isDefault}
                        onChange={(a: any, value: any) => {
                          onChangeSupplierToDefault(option, value);
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
          )}
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <SettingsIcon stroke={"#000000"} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={onOpenUpdatePricePerTon}>
              Update Price per ton
            </MenuItem>
            <MenuItem onClick={onOpenUpdateUnitPrice}>
              Update unit price
            </MenuItem>
            <MenuItem onClick={onOpenAddPercentToPrice}>
              Add Precent to price
            </MenuItem>
            <MenuItem onClick={updateToActive}>Change to Active</MenuItem>
            <MenuItem onClick={updateToInActive}>Change to InActive</MenuItem>
            <MenuItem onClick={onOpenUpdateCurrency}>Update Currency</MenuItem>
          </Menu>
        </div>
      </div>
    );
  }, [selectedMaterials, open, anchorEl, sheetStore]);

  const [sheetCheckStore, setSheetCheckStore] =
    useRecoilState(sheetCheckAllState);

  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={t("materials.sheetPaper.title")} side={Side()}>
        {renderHeader()}
        <div style={{ paddingLeft: 0 }}>
          {allWeightsGrouped.length === 0 ? (
            <div style={clasess.noData}>
              There is supplier added to this sheet yet,
              <span style={clasess.noDataSpan} onClick={onClickAddNewSupplier}>
                Please add new one now.
              </span>
            </div>
          ) : (
            <>
              {["header", ...allWeightsGrouped]?.map(
                (row: any, index: number) => {
                  if (row === "header") {
                    return (
                      <div
                        style={{
                          ...clasess.header,
                        }}
                      >
                        <div
                          style={{
                            width: "5%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            onChange={() => {
                              setSheetCheckStore(!sheetCheckStore);
                            }}
                            checked={sheetCheckStore}
                          />
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
                          Weight
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
                          <div
                            style={
                              index % 2 == 0
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
                              Size
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
                              Thickness
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
                              cost ($) per unit/ton
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
                              Directions
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
                              Active
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
                              Currency
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
                              Stock
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      style={{ ...clasess.bodyRow, borderBottom: "1px solid" }}
                    >
                      <div
                        style={{
                          width: "5%",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          minHeight: 60,
                          paddingTop: 20,
                          paddingBottom: 20,
                          gap: 35,
                        }}
                      >
                        {row?.sheetSizes.length &&
                          row?.sheetSizes?.map((size: any, index2: number) => {
                            return (
                              <div
                                style={{
                                  width: "5%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <SheetCheckBox
                                  selectedItems={selectedItems}
                                  handleCheckboxChange={handleCheckboxChange}
                                  size={size}
                                  row={row}
                                />
                              </div>
                            );
                          })}
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
                                {/* <div
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
                          </div> */}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
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
              justifyContent: "space-between",
            }}
          >
            {suppliers?.length > 0 && (
              <>
                {" "}
                <GoMakeAutoComplate
                  placeholder={"Select a Supplier"}
                  options={suppliers}
                  onChange={(value: any, item: any) => {
                    setSelectedSupplier(item?.value);
                  }}
                />
                <GomakePrimaryButton
                  style={{ marginTop: 20 }}
                  onClick={onClickAddSupplier}
                >
                  Add Supplier
                </GomakePrimaryButton>
              </>
            )}
          </div>
        </GoMakeModal>
        <UpdatePricePerTonModal
          openModal={isUpdatePricePerTon}
          onClose={onCloseUpdatePricePerTon}
          onClickBtn={updatePricePetTon}
          onChangeData={setData}
        />
        <UpdateCurrencyModal
          openModal={isUpdateCurrency}
          onClose={onCloseUpdateCurrency}
          onClickBtn={updatePricePetTon}
          onChangeData={setData}
        />
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
