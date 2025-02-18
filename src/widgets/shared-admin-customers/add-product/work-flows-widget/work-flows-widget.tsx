import { useStyle } from "./style";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import { useTranslation } from "react-i18next";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { ActionsListMenu } from "@/widgets/product-pricing-widget/components/actions-menu";
import { useWorkFlows } from "./use-work-flows";
import { CircularProgress, Typography } from "@mui/material";

const WorkFlowsWidget = () => {
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
  } = useWorkFlows();

  return (
    <div style={clasess.mainContainer}>
      <div
        style={clasess.autoCompleteSelectedSectionName}
        onClick={(e) => {
          handleOpenActionsListMenu(e);
        }}
      >
        {t("pricingWidget.addAction")}
        <ArrowDropDownIcon />
      </div>
      {/* <GeneralInformationComponent details={generalInformation} /> */}
      <div style={{ width: "100%" }}>
        {productActions?.length > 0 ? (
          <Actions
            actions={productActions}
            isFromSetting={true}
            deleteActionFromProduct={deleteActionFromProduct}
            updateActionsOrderInProduct={updateActionsOrderInProduct}
            updateProductAction={updateProductAction}
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
    </div>
  );
};

export { WorkFlowsWidget };
