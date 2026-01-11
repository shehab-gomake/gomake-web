import { GoMakeMenu, ThreeOptionsModal } from "@/components";
import { Divider, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { currentCalculationConnectionId } from "@/store";
import {
  DeleteSettingsIcon,
  OsSettingsIcon,
  PrinterIcon,
  ProfitIcon,
  ProportiesIcon,
} from "@/icons";
import { deleteActionToWorkFlowApi } from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useState } from "react";
import { ModalType } from "@/enums";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const SettingsMenu = ({
  handleClose,
  open,
  anchorEl,
  actionId,
  actionName,
  machineName,
  mongoDBMachineId,
  categoryId,
  productType,
  id,
  sectionName,
  deleteActionFromProduct,
  isFromSetting,
  hideRelatedActions,
}) => {
  const { t } = useTranslation();
  const currentSignalRConnectionId = useRecoilValue(
    currentCalculationConnectionId
  );
  const { callApi } = useGomakeAxios();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onClickCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onClickOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };
  const onClickProfit = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickProporties = () => {
    const uri = `/properties?actionId=${actionId}&actionName=${actionName}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickOsSettings = () => {
    const uri = `/products/profits?actionId=${actionId}&actionName=${actionName}&isOutSource=true`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickMachine = () => {
    const uri = `/machines/category/${categoryId}?machineId=${mongoDBMachineId}`;
    window.open(uri, "_blank");
    handleClose();
  };
  const onClickDeleteActionToWorkFlow = async (data) => {
    const callBack = (res) => {
      if (res.success) {
        handleClose();
      }
    };
    await deleteActionToWorkFlowApi(callApi, callBack, {
      signalRConnectionId: currentSignalRConnectionId,
      productType: data?.productType,
      actionId: data?.actionId,
      sectionName: data?.sectionName,
      printingActionId: data?.id,
      updateWorkFlowData: data?.updateWorkFlowData,
    });
  };
  return (
    <>
      {!hideRelatedActions ? (
        <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
          <MenuItem
            onClick={onClickProfit}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <ProfitIcon />
            {t("products.profits.admin.title")}
          </MenuItem>
          <MenuItem
            onClick={onClickProporties}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <ProportiesIcon />
            {t("products.profits.admin.proporties")}
          </MenuItem>
          <MenuItem
            onClick={onClickOsSettings}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <OsSettingsIcon />
            {t("products.profits.admin.OSSettings")}
          </MenuItem>
          {machineName && (
            <MenuItem
              onClick={onClickMachine}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <PrinterIcon />
              {t("products.offsetPrice.admin.machine")}
            </MenuItem>
          )}
          <PermissionCheck userPermission={Permissions.CUSTOMIZE_WORKFLOW}>
            <Divider />
            <MenuItem
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
              onClick={() => {
                if (isFromSetting) {
                  deleteActionFromProduct(actionId);
                } else {
                  onClickOpenDeleteModal();
                }
              }}
            >
              <DeleteSettingsIcon />
              {t("navigationButtons.delete")}
            </MenuItem>
          </PermissionCheck>
        </GoMakeMenu>
      ) : (
        <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
          <MenuItem
            onClick={() => {
              const uri = `/products/profits?actionId=5f3e9084-6724-4358-9f94-8c63019c8894&actionName=Raw materials`;
              window.open(uri, "_blank");
            }}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <ProfitIcon />
            {t("products.profits.admin.title")}
          </MenuItem>
        </GoMakeMenu>
      )}

      <ThreeOptionsModal
        openModal={openDeleteModal}
        onClose={onClickCloseDeleteModal}
        modalType={ModalType.DELETE}
        yesBtn={t("products.profits.admin.deleteAndUpdatePrice")}
        noBtn={t("products.profits.admin.deleteWithoutUpdatePrice")}
        onClickYes={() =>
          onClickDeleteActionToWorkFlow({
            id,
            actionId,
            productType,
            sectionName,
            updateWorkFlowData: true,
          })
        }
        onClickNo={() =>
          onClickDeleteActionToWorkFlow({
            id,
            actionId,
            productType,
            sectionName,
            updateWorkFlowData: false,
          })
        }
      />
    </>
  );
};

export { SettingsMenu };
