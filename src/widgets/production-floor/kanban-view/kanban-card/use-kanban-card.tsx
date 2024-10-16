import { ColoredCycle } from "@/components";
import { useGomakeAxios } from "@/hooks";
import {
  resetProductionFloorJobColorApi,
  updateProductionFloorJobColorApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { useRouter } from "next/router";
import { useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { ResetColorIcon } from "../../table-view/status-table/table-row/more-circle/icons/reset-color";

const useKanbanCard = (board: any) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const { push } = useRouter();
  const { callApi } = useGomakeAxios();
  const [color, setColor] = useState(board?.productionFloorJobColor ?? "");
  const [initialColor, setInitialColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleOpenMission = (event: React.MouseEvent) => {
    if (!showColorPicker) {
      push(
        `/production-floor?boardMissionsId=${board?.id}&productType=${board?.productType}&step=stations`
      );
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!showColorPicker) {
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  const onResetJobColor = async () => {
    const callBack = (res: any) => {
      if (res.success) {
        // Handle success case
        //setColor(res?.data)
      } else {
        // Handle failure case
      }
    };
    await resetProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: board?.id,
    });
  };

  const onChangeJobColor = async () => {
    const callBack = (res: any) => {};
    await updateProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: board?.id,
      productionFloorJobColor: color,
    });
  };

  const handleChangeColorClick = () => {
    setInitialColor(color);
    setShowColorPicker(true);
  };

  const contextMenuOptions = [
    {
      label: t("productionFloor.changeColor"),
      icon: <ColoredCycle backgroundColor={color || "#000000"} size={12} />,
      onClick: (e) => {
        e.stopPropagation();
        handleChangeColorClick();
      },
    },
    {
      label: t("productionFloor.resetColor"),
      icon: <ResetColorIcon width={14} height={14} color="#000000" />,
      onClick: (e) => {
        e.stopPropagation();
        onResetJobColor();
        handleCloseContextMenu();
      },
    },
  ];

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
    if (color !== initialColor) {
      onChangeJobColor();
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  return {
    t,
    dir,
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    handleOpenMission,
    contextMenuOptions,
    handleColorChange,
    color,
    showColorPicker,
    handleColorPickerClose,
    initialColor,
    isRTL,
  };
};
export { useKanbanCard };
