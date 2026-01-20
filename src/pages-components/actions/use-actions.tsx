import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useUserPermission } from "@/hooks/use-permission";
import { EditIcon } from "@/icons";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAllPrintHouseActions } from "@/services/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { matchSorter } from "match-sorter";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useActions = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { primarySecondaryBlend } = useGomakeTheme();
  const [term, setTerm] = useState("");
  const [materilasSearched, setMaterilasSearched] = useState([]);
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const [allActions, setAllActions] = useState<any>();
  const PRINTING_ACTION_ID = "52b26bea-82ef-4eb6-a031-ea7a9f856cbe";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [percentageProfit, setPercentageProfit] = useState("");

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onCloseModal = () => {
    setOpenModal(false);
  };
  const onOpenModal = () => {
    setOpenModal(true);
  };

  const getActions = useCallback(async () => {
    const data = await getAllPrintHouseActions(callApi, setAllActions, {
      WithRelatedActions: false
    });
    const mapData = data?.map((action) => [
      action?.name,
      action?.isActive ? (
        <div
          style={{
            display: "inline-flex",
            ...FONT_FAMILY.Lexend(500, 14),
            color: "#40CC4E",
          }}
        >
          {t("usersSettings.active")}
        </div>
      ) : (
        <div
          style={{
            display: "inline-flex",
            ...FONT_FAMILY.Lexend(500, 14),
            color: "#D92C2C",
          }}
        >
          {t("usersSettings.inactive")}
        </div>
      ),
      <PermissionCheck userPermission={Permissions.EDIT_MACHINE}>
        <PrimaryButton
          style={{
            color: primarySecondaryBlend(500),
          }}
          data-tour={
            action?.id === PRINTING_ACTION_ID ? "editPrintingAction" : undefined
          }
          startIcon={
            <EditIcon stroke={primarySecondaryBlend(500)} width={20} height={20} />
          }
          onClick={() =>
            navigate(
              `/products/profits?actionId=${action?.actionId}&&actionName=${action?.name}`
            )
          }
          variant={"text"}
        >
          {t("materials.buttons.edit")}
        </PrimaryButton>
      </PermissionCheck>,
      <PermissionCheck userPermission={Permissions.EDIT_MACHINE}>
        <PrimaryButton
          style={{
            color: primarySecondaryBlend(500),
          }}
          startIcon={
            <EditIcon stroke={primarySecondaryBlend(500)} width={20} height={20} />
          }
          onClick={() =>
            navigate(
              `/products/profits?actionId=${action?.actionId}&actionName=${action?.name}&isOutSource=true`
            )
          }
          variant={"text"}
        >
          {t("materials.buttons.edit")}
        </PrimaryButton>
      </PermissionCheck>,

      <PermissionCheck userPermission={Permissions.EDIT_PROPERTIES}>
        <PrimaryButton
          style={{
            color: primarySecondaryBlend(500),
          }}
          startIcon={
            <EditIcon stroke={primarySecondaryBlend(500)} width={20} height={20} />
          }
          onClick={() =>
            navigate(
              `/properties?actionId=${action?.actionId}&actionName=${action?.name}`
            )
          }
          variant={"text"}
        >
          {t("materials.buttons.edit")}
        </PrimaryButton>
      </PermissionCheck>,
    ]);
    setAllActions(mapData);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tableHeaders = [
    t("products.actions.actionName"),
    t("products.actions.active"),
    CheckPermission(Permissions.EDIT_MACHINE) && t("products.actions.profit"),
    CheckPermission(Permissions.EDIT_MACHINE) &&
    t("products.actions.outSource"),
    CheckPermission(Permissions.EDIT_PROPERTIES) &&
    t("products.actions.properties"),
  ];

  const filterArray = (array: any, searchText: string) =>
    array.filter((item) => {
      const matches = matchSorter([item[0]], searchText);
      return matches.length > 0;
    });

  useEffect(() => {
    if (allActions?.length) {
      const temp = filterArray(allActions, term);
      setMaterilasSearched(temp);
    }
  }, [term]);

  const AddNewProfitForActionProfitsApi = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/printhouse-config/profits/add-new-profit-for-action-profits`,
      {
        profit: percentageProfit,
      }
    );
    if (res?.success) {
      onCloseModal();
    } else {
      // Handle error response here
    }
  }, [percentageProfit]);

  return {
    tableHeaders,
    allActions,
    materilasSearched,
    term,
    anchorEl,
    openModal,
    percentageProfit,
    setTerm,
    t,
    handleMoreOptionIconClick,
    handleCloseMenu,
    onOpenModal,
    onCloseModal,
    setPercentageProfit,
    AddNewProfitForActionProfitsApi,
  };
};

export { useActions };
