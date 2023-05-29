import { useGomakeAxios } from "@/hooks";
import { EditIcon } from "@/icons";
import { getAndSetActions } from "@/services/hooks";
import { actionLists } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useActions = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useState<any>();
  const getActions = useCallback(async () => {
    const data = await getAndSetActions(callApi, setAllActions);
    const mapData = data?.map((item: any) => {
      return {
        name: item?.name,
        source: "Yes/No",
        active: "On/Off",
        profit: (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 6,
            }}
          >
            <EditIcon />
            <div>Edit</div>
          </div>
        ),
        properties: "Edit",
        id: item?.id,
      };
    });
    setAllActions(mapData);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tableHeaders = [
    t("products.actions.actionName"),
    t("products.actions.internalSource"),
    t("products.actions.active"),
    t("products.actions.profit"),
    t("products.actions.properties"),
  ];
  return { tableHeaders, allActions, t };
};

export { useActions };
