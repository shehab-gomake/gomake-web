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
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useKanbanCard = (board: any) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { push } = useRouter();
  const { callApi } = useGomakeAxios();
  const { primaryColor } = useGomakeTheme();

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
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  const onResetJobColor = async () => {
    const callBack = (res: any) => {
      if (res.success) {
        // Handle success case
      } else {
        // Handle failure case
      }
    };
    await resetProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: board?.id,
    });
  };

  const handleChangeColorClick = () => {
    setInitialColor(color); // Set the initial color when opening the color picker
    setShowColorPicker(true);
  };

  const CardColor = board?.productionFloorJobColor ?? "";

  const contextMenuOptions = [
    {
      label: t("productionFloor.changeColor"),
      icon: <ColoredCycle backgroundColor={CardColor || "#000000"} size={12} />,
      onClick: (e) => {
        e.stopPropagation();
        handleChangeColorClick();
        handleCloseContextMenu();
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

  const [color, setColor] = useState(CardColor);
  const [initialColor, setInitialColor] = useState(color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
    if (color !== initialColor) {
      onChangeJobColor();
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const onChangeJobColor = async () => {
    const callBack = (res: any) => {
      if (res.success) {
        // Handle success case
      } else {
        // Handle failure case
      }
    };
    await updateProductionFloorJobColorApi(callApi, callBack, {
      boardMissionId: board?.id,
      productionFloorJobColor: color,
    });
  };

  return {
    t,
    dir,
    CardColor,
    contextMenuPosition,
    handleContextMenu,
    handleCloseContextMenu,
    handleOpenMission,
    contextMenuOptions,

    handleColorChange,
    color,
    showColorPicker,
    handleColorPickerClose,
  };
};
export { useKanbanCard };
