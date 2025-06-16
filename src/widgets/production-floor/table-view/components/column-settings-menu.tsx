import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useRef, useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  columnOrderState,
  columnVisibilityState,
} from "../../state/column-order";
import { SecondSwitch } from "@/components";
import React from "react";

interface DragItem {
  id: string;
  index: number;
}

//!here
export const ColumnSettingsMenu = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [columnVisibility, setColumnVisibility] = useRecoilState(
    columnVisibilityState
  );
  const [columnOrder, setColumnOrder] = useRecoilState(columnOrderState);

  const draggingOrderRef = useRef([...columnOrder]);
  const [, forceUpdate] = useState(0); // used to force re-render

  const handleToggleColumn = (key: string) => {
    setColumnVisibility({
      ...columnVisibility,
      [key]: !columnVisibility[key],
    });
  };

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    const updated = [...draggingOrderRef.current];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    draggingOrderRef.current = updated;
    forceUpdate((n) => n + 1); // trigger re-render
  }, []);

  const handleDrop = () => {
    setColumnOrder(draggingOrderRef.current);
  };

  useEffect(() => {
    if (open) {
      draggingOrderRef.current = [...columnOrder]; // sync on open
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
        <DndProvider backend={HTML5Backend}>
          {draggingOrderRef.current.map((key, index) => (
            <DraggableMenuItem
              key={key}
              id={key}
              index={index}
              label={getLabel(t, key)}
              checked={columnVisibility[key]}
              onToggle={() => handleToggleColumn(key)}
              moveItem={moveItem}
              onDropComplete={handleDrop}
            />
          ))}
        </DndProvider>
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
    onDropComplete,
  }: {
    id: string;
    index: number;
    label: string;
    checked: boolean;
    onToggle: () => void;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    onDropComplete: () => void;
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
      end: () => {
        onDropComplete();
      },
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
          <DragIndicatorIcon fontSize="small" />
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
