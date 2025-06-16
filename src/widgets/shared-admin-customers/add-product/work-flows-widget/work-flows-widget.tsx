import { useStyle } from "./style";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import { useTranslation } from "react-i18next";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { ActionsListMenu } from "@/widgets/product-pricing-widget/components/actions-menu";
import { useWorkFlows } from "./use-work-flows";
import { Typography } from "@mui/material";
import { GoMakeDeleteModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { CopyAnotherProductsModal } from "./copy-another-products-modal";
import { EPricingViews, EWorkSource } from "@/widgets/product-pricing-widget/enums";
import { InOutSourceSelect } from "@/widgets/product-pricing-widget/components/in-out-source-select/in-out-source-select";
import { useModal } from "@/hooks/use-modal";

const WorkFlowsWidget = ({ productState, getProductById }: any) => {
  console.log("productState", productState);
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    productActions,
    actionListDropDown,
    anchorElActionsListMenu,
    openActionsListMenu,
    setActionNameSelected,
    handleCloseActionsListMenu,
    handleOpenActionsListMenu,
    onClickAddNewAction,
    addActionToProduct,
    deleteActionFromProduct,
    updateActionsOrderInProduct,
    updateProductAction,
    toggleIgnoreCalculatedWorkflows,
    customer,
    setCustomer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    openCopyAnotherProductsModal,
    handleOpenCopyAnotherProductsModal,
    handleCloseCopyAnotherProductsModal,
    view,
    setView,
    updateProductSourceType,
    sourceType,
    setSourceType,
  } = useWorkFlows({ getProductById, sourceTypeFromProduct: productState?.sourceType });
  const alertChangeSourceTypeModal = useModal();

  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.headerContainer}>
        <div style={clasess.switchContainer}>
          <SecondSwitch
            checked={productState?.ignoreCalculatedWorkflows}
            onChange={(e) => toggleIgnoreCalculatedWorkflows()}
          />
          <span style={clasess.switchLabel}>
            {t("pricingWidget.ignoreCalculatedWorkflow")}
          </span>
        </div>
        {productActions?.length > 0 && (
          <GomakePrimaryButton
            style={clasess.copyToAnotherProductsButton}
            onClick={handleOpenCopyAnotherProductsModal}
          >
            {t("pricingWidget.copyToAnotherProducts")}
          </GomakePrimaryButton>
        )}

        {view !== EPricingViews.OUTSOURCE_WORKFLOW && <div
          style={clasess.autoCompleteSelectedSectionName}
          onClick={(e) => {
            handleOpenActionsListMenu(e);
          }}
        >
          {t("pricingWidget.addAction")}
          <ArrowDropDownIcon />
        </div>}
        <InOutSourceSelect
          onChange={(v: EWorkSource) => {
            alertChangeSourceTypeModal.open();
            setSourceType(v);

          }}
          value={
            view === EPricingViews.OUTSOURCE_WORKFLOW
              ? EWorkSource.OUT
              : EWorkSource.INTERNAL
          }
        />
      </div>
      <div style={{ width: "100%" }}>
        {productActions?.length > 0 ? (
          <Actions
            actions={productActions}
            isFromSetting={true}
            deleteActionFromProduct={deleteActionFromProduct}
            updateActionsOrderInProduct={updateActionsOrderInProduct}
            updateProductAction={updateProductAction}
            customer={customer}
            setCustomer={setCustomer}
            renderOptions={renderOptions}
            checkWhatRenderArray={checkWhatRenderArray}
            isFetching={isFetching}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {" "}
              {t("pricingWidget.noActions")}{" "}
            </Typography>
          </div>
        )}
      </div>

      <ActionsListMenu
        handleClose={handleCloseActionsListMenu}
        open={openActionsListMenu}
        anchorEl={anchorElActionsListMenu}
        actionListDropDown={actionListDropDown}
        setActionNameSelected={setActionNameSelected}
        onClickAddNewAction={onClickAddNewAction}
        isUnderlined={true}
        isFromSetting={true}
        addActionToProduct={addActionToProduct}
      />
      <CopyAnotherProductsModal
        openModal={openCopyAnotherProductsModal}
        onClose={handleCloseCopyAnotherProductsModal}
      />
      <GoMakeDeleteModal
        open={alertChangeSourceTypeModal.isOpen}
        onClose={alertChangeSourceTypeModal.close}
        onClickDelete={() => {
          updateProductSourceType(sourceType);
          alertChangeSourceTypeModal.close();
        }}
        title={t("pricingWidget.changeSourceType")}
        subTitle={t("pricingWidget.changeSourceTypeDescription")}
        yesBtn={t("modal.confirm")}
      />
    </div>
  );
};

export { WorkFlowsWidget };
