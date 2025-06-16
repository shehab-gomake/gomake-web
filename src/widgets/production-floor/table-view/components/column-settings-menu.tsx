import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useRef, useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { SecondSwitch } from "@/components";
import React from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { updateCpaManagerMailApi } from "@/services/api-service/settings/finance-api";
import { PrimaryButton } from "@/components/button/primary-button";
import ReorderIcon from "@mui/icons-material/Reorder";
import { saveProductionFloorTableSettingsApi } from "@/services/api-service/production-floor/production-floor-table-settings";
import {
  allColumnKeys,
  columnOrderState,
  columnVisibilityState,
} from "../../state/production-floor-coulmns-table-settings";

interface DragItem {
  id: string;
  index: number;
}

export const ColumnSettingsMenu = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [columnVisibility, setColumnVisibility] = useRecoilState(
    columnVisibilityState
  );
  const [columnOrder, setColumnOrder] = useRecoilState(columnOrderState);

  const [tempColumnVisibility, setTempColumnVisibility] = useState(() => ({
    ...columnVisibility,
  }));
  const [tempColumnOrder, setTempColumnOrder] = useState(() => [
    ...columnOrder,
  ]);

  const draggingOrderRef = useRef([...columnOrder]);

  const handleToggleColumn = (key: string) => {
    setTempColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    const updated = [...draggingOrderRef.current];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    draggingOrderRef.current = updated;
    setTempColumnOrder([...updated]);
  }, []);

  const handleSave = async () => {
    const updatedVisibility = Object.fromEntries(
      allColumnKeys.map((key) => [key, !!tempColumnVisibility[key]])
    );

    const updatedColumns = tempColumnOrder.map((key) => ({
      key,
      visible: !!tempColumnVisibility[key],
    }));

    setColumnOrder(tempColumnOrder);
    setColumnVisibility(updatedVisibility);

    try {
      await saveProductionFloorTableSettingsApi(
        callApi,
        () => {},
        updatedColumns
      );
    } catch (error) {
      console.error("Failed to save column settings", error);
    }
    handleClose();
  };

  const handleCancel = () => {
    setTempColumnVisibility({ ...columnVisibility });
    setTempColumnOrder([...columnOrder]);
    handleClose();
  };

  const handleHideAll = () => {
    const hidden = Object.fromEntries(allColumnKeys.map((key) => [key, false]));
    setTempColumnVisibility(hidden);
  };

  const handleShowAll = () => {
    const shown = Object.fromEntries(allColumnKeys.map((key) => [key, true]));
    setTempColumnVisibility(shown);
  };

  const handleResetOrder = () => {
    setTempColumnOrder([...allColumnKeys]);
  };

  useEffect(() => {
    if (open) {
      draggingOrderRef.current = [...columnOrder];
    }
  }, [open, columnOrder]);

  return (
    <>
      <Tooltip title="Column visibility">
        <IconButton onClick={handleOpen}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Stack direction="row" justifyContent="space-between" px={1} py={1}>
          <PrimaryButton
            variant="text"
            style={{ fontSize: 12, padding: "4px 8px" }}
            onClick={handleHideAll}
          >
            {t("productionFloor.hideAll")}
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            style={{ fontSize: 12, padding: "4px 8px" }}
            onClick={handleResetOrder}
          >
            {t("productionFloor.resetOrder")}
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            style={{ fontSize: 12, padding: "4px 8px" }}
            onClick={handleShowAll}
          >
            {t("productionFloor.showAll")}
          </PrimaryButton>
        </Stack>

        <DndProvider backend={HTML5Backend}>
          {tempColumnOrder?.map((key, index) => (
            <DraggableMenuItem
              key={key}
              id={key}
              index={index}
              label={getLabel(t, key)}
              checked={tempColumnVisibility[key]}
              onToggle={() => handleToggleColumn(key)}
              moveItem={moveItem}
            />
          ))}
        </DndProvider>
        <Divider />
        <Stack direction="row" justifyContent="space-between" p={"0px 8px"}>
          <PrimaryButton
            style={{ width: "fit-content" }}
            onClick={handleCancel}
          >
            {t("modal.cancel")}
          </PrimaryButton>
          <PrimaryButton
            style={{ width: "fit-content" }}
            variant={"contained"}
            onClick={handleSave}
          >
            {t("sales.quote.save")}
          </PrimaryButton>
        </Stack>
      </Menu>
    </>
  );
};

const DraggableMenuItem = React.memo(
  ({
    id,
    index,
    label,
    checked,
    onToggle,
    moveItem,
  }: {
    id: string;
    index: number;
    label: string;
    checked: boolean;
    onToggle: () => void;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
  }) => {
    const ref = useRef<HTMLLIElement>(null);

    const [, drop] = useDrop<DragItem>({
      accept: "column",
      hover(item, monitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag<
      DragItem,
      void,
      { isDragging: boolean }
    >({
      type: "column",
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <MenuItem
        ref={ref}
        dense
        style={{
          opacity: isDragging ? 0.5 : 1,
          border: isDragging ? "1px dashed #2e3092" : "none",
          cursor: "move",
          transition: "opacity 0.15s ease",
        }}
      >
        <ListItemIcon>
          <ReorderIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={label} />
        <SecondSwitch
          variant="primary"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
      </MenuItem>
    );
  }
);

const getLabel = (t, key: string): string => {
  const map = {
    checkbox: t("productionFloor.checkBox"),
    job_order: `${t("productionFloor.job")} / ${t("SourceDocument.order")}`,
    deliveryDate: t("sales.quote.deliveryDate"),
    customer: t("productionFloor.customer"),
    agent: t("productionFloor.agent"),
    productName: t("sales.quote.productName"),
    description: t("sales.documentDeliveries.description"),
    notes: t("sales.quote.notes"),
    status: t("productionFloor.status"),
    currentStation: t("productionFloor.currentStation"),
    nextStation: t("productionFloor.nextStation"),
    more: t("productionFloor.moreMenu"),
  };
  return map[key] ?? key;
};
