import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EditIcon } from "@/icons";
import { getAllPrintHouseActions } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useActions = () => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useState<any>();
  const getActions = useCallback(async () => {
    const data = await getAllPrintHouseActions(callApi, setAllActions);
    const mapData = data?.map((action) => [
      action?.name,
      `${action?.isInternal ? "Yes" : "No"} / ${
        action?.isOutsource ? "Yes" : "No"
      }`,
      action?.isActive ? "Yes" : "No",
      <PrimaryButton
        startIcon={
          <EditIcon color={primaryColor(500)} width={20} height={20} />
        }
        onClick={() =>
          navigate(`/products/profits?actionId=${action?.actionId}`)
        }
        variant={"text"}
      >
        Edit
      </PrimaryButton>,
      // <span
      //   style={{
      //     display: "inline-flex",
      //     flexDirection: "row",
      //     justifyContent: "flex-start",
      //     alignItems: "center",
      //     gap: 6,
      //     cursor: "pointer",
      //     margin: "auto",
      //   }}
      //   onClick={() => navigate(`/products/profits?actionId=${category?.id}`)}
      // >
      //   <EditIcon />
      //   <div>Edit</div>
      // </span>,
      <div style={{ cursor: "pointer" }}>Edit</div>,
    ]);
    // const mapData = data?.map((item: any) => {
    //   return {
    //     name: item?.name,
    //     source: "Yes/No",
    //     active: "On/Off",
    //     profit: (
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "row",
    //           justifyContent: "flex-start",
    //           alignItems: "center",
    //           gap: 6,
    //           cursor: "pointer",
    //         }}
    //         onClick={() => navigate(`/products/profits?actionId=${item?.id}`)}
    //       >
    //         <EditIcon />
    //         <div>Edit</div>
    //       </div>
    //     ),
    //     properties: <div style={{ cursor: "pointer" }}>Edit</div>,
    //     id: item?.id,
    //   };
    // });
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
