import { GeneralInformationComponent } from "@/widgets/product-pricing-widget/components/general-information/general-information-component";
import { useStyle } from "./style";
import { Actions } from "@/widgets/product-pricing-widget/components/action/action-component";
import { useTranslation } from "react-i18next";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { ActionsListMenu } from "@/widgets/product-pricing-widget/components/actions-menu";
import { useWorkFlows } from "./use-work-flows";

const WorkFlowsWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    generalInformation,
    actions,
    actionListDropDown,
    anchorElActionsListMenu,
    openActionsListMenu,
    setActionNameSelected,
    handleCloseActionsListMenu,
    handleOpenActionsListMenu,
    onClickAddNewAction,
    addActionToProduct
  } = useWorkFlows();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.autoCompleteSelectedSectionName} onClick={(e) => {
        handleOpenActionsListMenu(e)
      }}>
        {t("pricingWidget.addAction")}
        <ArrowDropDownIcon />
      </div>
      <GeneralInformationComponent details={generalInformation} />
      <div>
        <Actions actions={actions} isFromSetting={true} />
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
