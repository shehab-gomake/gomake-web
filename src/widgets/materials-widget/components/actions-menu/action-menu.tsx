import { Checkbox, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useMaterialsActions } from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import { GoMakeAutoComplate, GoMakeDeleteModal, GoMakeDialog, GomakeTextInput } from "@/components";
import Stack from "@mui/material/Stack";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { useStyle } from "./style";
import { AddPlusIcon, CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { rowInputs } from "../add-row/inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { ModalType, UNIT_TYPE } from "@/enums";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { DuplicatesModal } from "../duplicates-modal";
import { DieCutAnalyzerDialog } from "../die-cut-analyzer/die-cut-analyzer-dialog";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { userState } from "@/store/user";
import { useRecoilValue } from "recoil";
import { Add as AddIcon } from "@mui/icons-material";

interface IActionMenuProps {
  isAdmin: boolean;
  subCategory?: string;
}
const ActionMenu = (props: IActionMenuProps) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [imgInputKey, setImgInputKey] = useState(Date.now());
  const {
    onChooseAction,
    action,
    updatedValue,
    onTextInputChange,
    onUpdate,
    checkedPrice,
    setCheckedPrice,
    setRate,
    rate,
    uploadExcelFile,
    updateMaterialsImages,
    elementRef,
    uploadImgRef,
    handleMoreOptionIconClick,
    anchorEl,
    handleCloseMenu,
    materialActions,
    _renderIcons,
    handleCloseModal,
    currencies,
    openDuplicatesModal,
    duplicatesData,
    handleDeleteSelectedMaterials,
    handleCloseDuplicatesModal,
    handleRefreshMaterialData,
    properties,
    materialHeaders,
    handleChange,
    deleteProperty,
    addProperty,
    updateModalCurrency,
    openUpdatedTableRowModal,
    onClickCloseUpdatedTableRowModal,
    updatedTableRowModal,
    // Submenu handlers
    handleSubmenuAction,
    isSubmenuModalOpen,
    submenuModalAction,
    handleCloseSubmenuModal,
    selectedSupplier,
    setSelectedSupplier,
    selectedSupplierForPurchaseOrder,
    setSelectedSupplierForPurchaseOrder,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    setOpenSupplierModal,
    openSupplierModal,
    materialType,
    materialCategory,
    openDieCutAnalyzerModal,
    setOpenDieCutAnalyzerModal
  } = useMaterialsActions(props.isAdmin);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubmenuAction, setCurrentSubmenuAction] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>([]);

  const onSupplierAdd = (supplier) => {
    setOpenSupplierModal(false);
  };


  const onCloseSupplierModal = () => {
    setOpenSupplierModal(false);
  };

  const getMaterialActions = () => {
    let filteredActions = materialActions;

    // Filter for admin users
    if (props.isAdmin) {
      filteredActions = filteredActions.filter(x => x.action !== EMaterialsActions.UpdateIsActive && x.action !== EMaterialsActions.UpdateIsInActive && x.action !== EMaterialsActions.CreatePurchaseOrder);
    }

    // Always hide Upload Materials Pictures
    filteredActions = filteredActions.filter(x => x.action !== EMaterialsActions.UploadMaterialsPictures);

    // When no subCategory, show only Download Excel, Upload Excel, and Die Cut Analyzer
    if (!props.subCategory) {
      filteredActions = filteredActions.filter(x =>
        x.action === EMaterialsActions.DownLoadExcel ||
        x.action === EMaterialsActions.UploadExcel ||
        x.action === EMaterialsActions.DieCutAnalyzer
      );
    }

    return filteredActions;
  };

  const handleMenuItemClick = (action: any, event: React.MouseEvent<HTMLLIElement>) => {
    if (action.isShowSubMenu) {
      setSubmenuAnchorEl(event.currentTarget);
      setCurrentSubmenuAction(action);
    } else {
      onChooseAction(action);
      handleCloseMenu();
    }
  };

  const handleSubmenuClose = () => {
    setSubmenuAnchorEl(null);
    setCurrentSubmenuAction(null);
  };

  const handleSubmenuItemClick = (submenuOption: number) => {
    if (currentSubmenuAction) {
      // All submenu options should go through the same flow with submenuOption
      onChooseAction({ ...currentSubmenuAction, submenuOption });
    }
    handleSubmenuClose();
    handleCloseMenu();
  };
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;


  const getTranslationKey = (actionItem: any) => {
    const isImperial = unitType === UNIT_TYPE.IMPERIAL;

    // Special keys for action 4 (UpdatePricePerUnit) when Imperial
    if (actionItem.action === EMaterialsActions.UpdatePricePerUnit && isImperial && materialType === "sheets") {
      return "materialsActions." + "UpdateUnitPriceImperial";
    }

    // Special keys for action 6 (UpdatePricePerTonPercents) when Imperial
    if (actionItem.action === EMaterialsActions.UpdatePricePerUnitPercents && isImperial && materialType === "sheets") {
      return "materialsActions." + "AddPercentToUnitPriceImperial";
    }

    // Default key
    return "materialsActions." + actionItem.text;
  };

  return (
    <>
      <IconButton data-tour={'materialsActions'} onClick={handleMoreOptionIconClick} style={{ padding: 0 }}>
        <SettingsIcon stroke={"#000000"} />
      </IconButton>
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
      <input
        key={imgInputKey}
        ref={uploadImgRef}
        onChange={(e) => {
          updateMaterialsImages(e);
          setImgInputKey(Date.now());
        }}
        type="file"
        accept=".zip,.rar,.7zip"
        hidden={true}
      />
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        {(() => {
          const filteredActions = getMaterialActions();
          const hasAnySubmenu = filteredActions?.some(action => action.isShowSubMenu);

          return filteredActions?.map((actionItem) => {
            return (
              <React.Fragment key={actionItem.action}>
                <MenuItem
                  style={clasess.menuItemContainer}
                  onClick={(e) => handleMenuItemClick(actionItem, e)}
                >
                  <div style={clasess.menuItemContainer1}>
                    {actionItem.isShowSubMenu ? (
                      <>
                        {
                          isRTL ? <ChevronRightIcon sx={{ ml: "auto", color: "rgb(130, 131, 190)" }} /> : <ChevronLeftIcon sx={{ ml: "auto", color: "rgb(130, 131, 190)" }} />
                        }
                      </>
                    ) : hasAnySubmenu ? <div style={{ width: 24, height: 24 }} /> : null}
                    <div style={clasess.actionIconStyle}>
                      {_renderIcons(actionItem.icon)}
                    </div>
                    <div style={clasess.rowTextStyle}>
                      {t(getTranslationKey(actionItem))}
                    </div>
                  </div>
                </MenuItem>
                {actionItem?.isUnderLine && <Divider />}
              </React.Fragment>
            );
          });
        })()}
      </Menu>

      {/* Submenu */}
      <Menu
        open={Boolean(submenuAnchorEl)}
        anchorEl={submenuAnchorEl}
        onClose={handleSubmenuClose}
        anchorOrigin={{ horizontal: isRTL ? "right" : "left", vertical: "top" }}
        transformOrigin={{ horizontal: isRTL ? "left" : "right", vertical: "top" }}
      >
        <MenuItem onClick={() => handleSubmenuItemClick(0)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateDefaultSaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(1)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateInventorySaleCost")}
        </MenuItem>
        <MenuItem onClick={() => handleSubmenuItemClick(2)} style={clasess.rowTextStyle}>
          {t("materialsActions.updateSupplierPurchasePrice")}
        </MenuItem>
      </Menu>
      {action?.action === EMaterialsActions.Delete ?
        <GoMakeDeleteModal
          modalType={ModalType.DELETE}
          openModal={action !== null}
          onClose={handleCloseModal}
          onClickDelete={onUpdate}
        />
        :
        <GoMakeDialog
          open={action !== null}
          onClose={handleCloseModal}
          title={t("materialsActions." + action?.text)}
          primaryButtonLabel={action?.action === EMaterialsActions.CreatePurchaseOrder ? t("materialsActions." + action?.text) : t("profileSettings.update")}
          cancelButtonLabel={t("materials.childTable.cancel")}
          onPrimaryAction={onUpdate}
          maxWidth="sm"
          fullWidth
        >
          <Stack
            gap={3}
            alignItems={"center"}
            justifyContent={"center"}
            minWidth={"350px"}
            paddingTop={"8px"}
          >
            {action?.action === EMaterialsActions.UpdateCurrency ? (
              <div style={clasess.UpdateCurrencyView}>
                {/* Supplier Selection - Show for submenu options 1 and 2 */}
                {(action?.submenuOption === 1 || action?.submenuOption === 2) && (
                  <div style={{ width: "100%" }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                      {t("materials.childTable.supplier")}
                      <IconButton onClick={() => setOpenSupplierModal(true)} size="small">
                        <AddIcon sx={{ color: "#f50057" }} />
                      </IconButton>
                    </div>
                    <ClientAutocomplete
                      key={selectedSupplier?.id}
                      clientType={CLIENT_TYPE.SUPPLIER}
                      onChange={(e: any, supplier: any) => setSelectedSupplier(supplier)}
                      options={(renderOptionsSupplier || []).filter((supplier, index, self) =>
                        index === self.findIndex((s) => s.id === supplier.id)
                      )}
                      placeholder={t("materials.childTable.selectSupplier")}
                      style={{ width: "100%" }}
                      value={selectedSupplier}
                      onChangeTextField={checkWhatRenderArraySupplier}
                      loading={isFetchingSupplier}
                      getOptionLabel={(option: any) => `${option.name}`}
                    />
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>
                    {t("materials.childTable.currency")}
                  </div>
                  <GoMakeAutoComplate
                    style={{ width: "100%" }}
                    value={updatedValue}
                    options={currencies}
                    onChange={(e, value) => {
                      updateModalCurrency(value?.value)
                    }}
                    disableClearable
                    placeholder={t("materials.inputs.chooseCurrency")}
                  />
                </div>

                <div style={clasess.priceCheckedContainer}>
                  <Checkbox
                    icon={<CheckboxIcon />}
                    checkedIcon={<CheckboxCheckedIcon />}
                    onChange={() => {
                      setCheckedPrice(!checkedPrice);
                      if (!checkedPrice) {
                        setRate(null);
                      }
                    }}
                    checked={checkedPrice}
                  />
                  <div style={clasess.secondText}>{t("materials.inputs.updatePrices")}</div>
                </div>
                {rate && (
                  <GomakeTextInput
                    style={{
                      border: "0px",
                      background: "#fff",
                      borderRadius: 4,
                      height: 40,
                    }}
                    onChange={(e: any) => {
                      setRate(e.target.value);
                    }}
                    value={rate}
                  />
                )}
              </div>
            ) : action?.action === EMaterialsActions.Duplicate ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  width: "100%",
                  gap: 10,
                  overflowY: "scroll",
                  maxHeight: 500,
                  padding: 10,
                  paddingTop: 0,
                }}
                className="custom-scrollbar"
              >
                {properties?.map((item, index) => {
                  return (
                    <div
                      key={`duplicate-row-${index}-${item?.key?.key}`}  // Better key
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        height: item?.key?.key === "image" ? 155 : "100%",
                      }}
                    >
                      <div style={{ width: "50%", height: "100%" }}>
                        <GoMakeAutoComplate
                          placeholder={"select property"}
                          getOptionLabel={(option: any) => option.value}
                          value={item?.key || null}  // Add value prop
                          options={materialHeaders.filter(x =>
                            !x.isHideInDuplicate &&
                            x.key !== "Active" &&
                            x.key !== "totalInventory" &&
                            x.key !== "purchasePricing"
                          )}
                          onChange={(event, value) => {
                            handleChange(index, "key", value);
                          }}
                        />
                      </div>
                      <div style={{ width: "50%", height: "100%" }}>
                        {properties[index].key &&
                          rowInputs(
                            properties[index].key,
                            false,
                            materialHeaders,
                            currencies,
                            [],
                            [],
                            [item?.key]
                          ).map((formInputItem, itemIndex) => {
                            return (
                              <FormInput
                                key={`duplicate-input-${index}-${itemIndex}`}  // Better key with index
                                input={{
                                  ...formInputItem,
                                  value: formInputItem.multiple
                                    ? properties[index].values || formInputItem.value
                                    : properties[index].values?.[properties[index].values.length - 1] || formInputItem.value,
                                }}
                                changeState={(paramKey, value) =>
                                  handleChange(index, "values", value)
                                }
                                error={false}
                                readonly={false}
                                hideLabel={true}
                              />
                            )
                          }
                          )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          marginTop: "2%",
                        }}
                        onClick={() => deleteProperty(index)}
                      >
                        <DeleteMenuIcon />
                      </div>
                    </div>
                  );
                })}
                <div style={clasess.AddNewRuleDiv}>
                  <AddPlusIcon />
                  <span onClick={addProperty} style={clasess.spanAddNewRule}>
                    {t("properties.addNewRule")}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start",
                alignContent: "flex-start", width: "100%", gap: 15,
              }}>
                {/* Supplier Selection - Show for CreatePurchaseOrder */}
                {action?.action === EMaterialsActions.CreatePurchaseOrder && (
                  <div style={{ width: "100%" }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                      {t("materials.childTable.supplier")}
                      <IconButton onClick={() => setOpenSupplierModal(true)} size="small">
                        <AddIcon sx={{ color: "#f50057" }} />
                      </IconButton>
                    </div>
                    <ClientAutocomplete
                      key={selectedSupplierForPurchaseOrder?.id}
                      clientType={CLIENT_TYPE.SUPPLIER}
                      onChange={(e: any, supplier: any) => setSelectedSupplierForPurchaseOrder(supplier)}
                      options={renderOptionsSupplier || []}
                      placeholder={t("materials.childTable.searchAndSelectSupplier")}
                      style={{ width: "100%" }}
                      value={selectedSupplierForPurchaseOrder}
                      onChangeTextField={checkWhatRenderArraySupplier}
                      loading={isFetchingSupplier}
                      getOptionLabel={(option: any) => `${option.name}`}
                      customStyle={{
                        borderBottom: "none",
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}

                {action?.action === EMaterialsActions.CreatePurchaseOrder && <div style={{ marginBottom: 10, marginTop: 15 }}>{t("boardMissions.package")}</div>}

                {/* Supplier Selection - Show for submenu options 1 and 2 */}
                {(action?.submenuOption === 1 || action?.submenuOption === 2) && (
                  <div style={{ width: "100%" }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                      {t("materials.childTable.supplier")}
                      <IconButton onClick={() => setOpenSupplierModal(true)} size="small">
                        <AddIcon sx={{ color: "#f50057" }} />
                      </IconButton>
                    </div>
                    <ClientAutocomplete
                      key={selectedSupplier?.id}
                      clientType={CLIENT_TYPE.SUPPLIER}
                      onChange={(e: any, supplier: any) => setSelectedSupplier(supplier)}
                      options={(renderOptionsSupplier || []).filter((supplier, index, self) =>
                        index === self.findIndex((s) => s.id === supplier.id)
                      )}
                      placeholder={t("materials.childTable.selectSupplier")}
                      style={{ width: "100%" }}
                      value={selectedSupplier}
                      onChangeTextField={checkWhatRenderArraySupplier}
                      loading={isFetchingSupplier}
                      getOptionLabel={(option: any) => `${option.name}`}
                    />
                  </div>
                )}

                <div style={{ width: "100%" }}>
                  {/* {action?.submenuOption !== undefined && (
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>
                      {t("products.profits.pricingListWidget.price")}
                    </div>
                  )} */}
                  <GomakeTextInput
                    onChange={(e) => onTextInputChange(e.target.value)}
                    value={updatedValue}
                    type={action?.action === EMaterialsActions.CreatePurchaseOrder ? "number" : action?.submenuOption !== undefined ? "number" : undefined}
                    placeholder={action?.submenuOption !== undefined ? t("reports.enterPrice") : undefined}
                    style={{
                      borderBottom: !updatedValue ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>

            )}
          </Stack>
        </GoMakeDialog>
      }
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openUpdatedTableRowModal}
        onClose={onClickCloseUpdatedTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={updatedTableRowModal}
      />

      {/* Supplier Add Modal */}
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.SUPPLIER}
        onCustomerAdd={onSupplierAdd}
        openModal={openSupplierModal}
        onClose={onCloseSupplierModal}
        customer={supplier}
        setCustomer={setSupplier}
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

      {/* Die-Cut Analyzer Modal */}
      <DieCutAnalyzerDialog
        open={openDieCutAnalyzerModal}
        onClose={() => setOpenDieCutAnalyzerModal(false)}
      />
    </>
  );
};


export { ActionMenu };
