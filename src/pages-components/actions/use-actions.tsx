import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { usePermission } from "@/hooks/use-permission";
import { EditIcon } from "@/icons";
import { getAllPrintHouseActions } from "@/services/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { matchSorter } from "match-sorter";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useActions = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { primaryColor } = useGomakeTheme();
  const [term, setTerm] = useState("");
  const [materilasSearched, setMaterilasSearched] = useState([]);
  const { t } = useTranslation();
  const { CheckPermission } = usePermission();
  const [allActions, setAllActions] = useState<any>();
  const getActions = useCallback(async () => {
    const data = await getAllPrintHouseActions(callApi, setAllActions);
    const mapData = data?.map((action) => [
      action?.name,
      `${
        action?.isInternal ? t("sales.quote.yesBtn") : t("sales.quote.noBtn")
      } / ${
        action?.isOutsource ? t("sales.quote.yesBtn") : t("sales.quote.noBtn")
      }`,
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
          startIcon={
            <EditIcon color={primaryColor(500)} width={20} height={20} />
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
      <PermissionCheck userPermission={Permissions.EDIT_PROPERTIES}>
        <PrimaryButton
          startIcon={
            <EditIcon color={primaryColor(500)} width={20} height={20} />
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
    t("products.actions.internalSource"),
    t("products.actions.active"),
    CheckPermission(Permissions.EDIT_MACHINE) && t("products.actions.profit"),
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
  return { tableHeaders, allActions, materilasSearched, term, setTerm, t };
};

export { useActions };
