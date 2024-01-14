import { useRecoilState, useSetRecoilState } from "recoil";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import {
  materialCategoryDataState,
  openAddRowModalState,
} from "@/widgets/materials-widget/state";
import { useEffect, useState } from "react";
import { EMaterialsActions } from "@/widgets/materials-widget/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { updatePrintHouseMaterialsPropApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { updateMaterialsPropApi } from "@/services/api-service/materials/materials-endpoints";
import { useExchangeRate } from "@/hooks/use-exchange-rate";

const useMaterialsActions = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
    IMaterialCategoryRow[]
  >(materialCategoryDataState);
  const [action, setAction] = useState<{
    action: EMaterialsActions;
    key: string;
  } | null>(null);
  const [updatedValue, setUpdatedValue] = useState<string>("");
  console.log("updatedValue", updatedValue);
  const [checkedPrice, setCheckedPrice] = useState(false);
  const { rate, setRate, getExchangeRate } = useExchangeRate();
  useEffect(() => {
    if (checkedPrice) getExchangeRate("usd", updatedValue);
  }, [checkedPrice, updatedValue]);
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const setOpenAddRowModal = useSetRecoilState<boolean>(openAddRowModalState);
  const getSelectedMaterialsIds = () =>
    materialCategoryData.filter((row) => row.checked).map((row) => row.id);
  const onChooseAction = async (
    action: { action: EMaterialsActions; key: string } | null
  ) => {
    if (action?.action === EMaterialsActions.AddNew) {
      setOpenAddRowModal(true);
      return;
    }
    if (getSelectedMaterialsIds().length === 0) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.noMaterialsSelected"),
        type: "error",
      });
      return;
    }
    if (
      action?.action === EMaterialsActions.UpdateIsActive ||
      action?.action === EMaterialsActions.UpdateIsInActive
    ) {
      await updateStatus(action?.action);
      return;
    }
    setAction(action);
  };

  const onTextInputChange = (v: string) => {
    setUpdatedValue(v);
  };

  const onInputChange = (key: string, v: any) => {
    setUpdatedValue(v);
  };

  const onUpdate = async () => {
    if (action !== null) {
      if (isAdmin) {
        await updateMaterialsPropApi(callApi, onUpdateCallBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: getSelectedMaterialsIds(),
          action: action.action,
          priceIndex: 0,
          exchangeRate: rate,
        });
      } else {
        await updatePrintHouseMaterialsPropApi(callApi, onUpdateCallBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: materialCategory.toString(),
          ids: getSelectedMaterialsIds(),
          action: action.action,
          priceIndex: 0,
          updatedValue,
          exchangeRate: rate,
        });
      }
    }
  };

  const onUpdateCallBack = (res) => {
    if (res.success) {
      setMaterialCategoryData(
        materialCategoryData.map((material) =>
          material.checked
            ? {
                ...material,
                ...res.data?.find((row) => row.id === material.id),
              }
            : material
        )
      );
    }
    setAction(null);
    setUpdatedValue("");
  };
  const updateStatus = async (eAction: EMaterialsActions) => {
    if (isAdmin) {
      await updateMaterialsPropApi(callApi, onUpdateCallBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: materialCategory.toString(),
        ids: getSelectedMaterialsIds(),
        action: eAction,
        priceIndex: 0,
      });
    } else {
      await updatePrintHouseMaterialsPropApi(callApi, onUpdateCallBack, {
        materialTypeKey: materialType.toString(),
        categoryKey: materialCategory.toString(),
        ids: getSelectedMaterialsIds(),
        action: eAction,
        priceIndex: 0,
      });
    }
  };
  return {
    getSelectedMaterialsIds,
    onChooseAction,
    action,
    updatedValue,
    onTextInputChange,
    onInputChange,
    onUpdate,
    checkedPrice,
    setCheckedPrice,
    setRate,
  };
};

export { useMaterialsActions };
