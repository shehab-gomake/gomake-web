import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  columnOrderState,
  columnVisibilityState,
} from "../../state/column-order";
import { SecondSwitch } from "@/components";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

interface DragItem {
  id: string;
  index: number;
}

//!here new
export const ColumnSettingsMenu = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [columnVisibility, setColumnVisibility] = useRecoilState(
    columnVisibilityState
  );
  const [columnOrder, setColumnOrder] = useRecoilState(columnOrderState);

  const handleToggleColumn = (key: string) => {
    setColumnVisibility({
      ...columnVisibility,
      [key]: !columnVisibility[key],
    });
  };

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const moveItem = (dragIndex, hoverIndex) => {
    const updated = [...columnOrder];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setColumnOrder(updated);
  };

  return (
    <>
      <Tooltip title="Column visibility">
        <IconButton onClick={handleOpen}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <DndProvider backend={HTML5Backend}>
          {columnOrder.map((key, index) => (
            <DraggableMenuItem
              key={key}
              id={key}
              index={index}
              label={getLabel(t, key)}
              checked={columnVisibility[key]}
              onToggle={() => handleToggleColumn(key)}
              moveItem={moveItem}
            />
          ))}
        </DndProvider>
      </Menu>
    </>
  );
};

const DraggableMenuItem = ({
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
};

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
