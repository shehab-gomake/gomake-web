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
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useRef, useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GoMakeMenu, SecondSwitch } from "@/components";
import React from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { PrimaryButton } from "@/components/button/primary-button";
import ReorderIcon from "@mui/icons-material/Reorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  columnOrderStateFamily,
  columnVisibilityStateFamily,
  documentColumnKeys,
} from "../../states/documents-coulmns-settings-state";
import { saveDocumentTableSettingsApi } from "@/services/api-service/generic-doc/documents-api";
import { useStyle } from "./style";

interface DragItem {
  id: string;
  index: number;
}

//!here new main component
export const DocumentsColumnSettingsMenu = ({ tableKey, documentType }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [columnVisibility, setColumnVisibility] = useRecoilState(
    columnVisibilityStateFamily(tableKey)
  );
  const [columnOrder, setColumnOrder] = useRecoilState(
    columnOrderStateFamily(tableKey)
  );

  const allKeys = documentColumnKeys[tableKey];

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

  //!here impo
  const handleSave = async () => {
    const updatedVisibility = Object.fromEntries(
      allKeys.map((key) => [key, !!tempColumnVisibility[key]])
    );

    const updatedColumns = tempColumnOrder.map((key) => ({
      key,
      visible: !!tempColumnVisibility[key],
    }));

    setColumnOrder(tempColumnOrder);
    setColumnVisibility(updatedVisibility);

    try {
      await saveDocumentTableSettingsApi(callApi, () => {}, {
        documentType,
        updatedColumns,
      });
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
    const hidden = Object.fromEntries(allKeys.map((key) => [key, false]));
    setTempColumnVisibility(hidden);
  };

  const handleShowAll = () => {
    const shown = Object.fromEntries(allKeys.map((key) => [key, true]));
    setTempColumnVisibility(shown);
  };

  const handleResetOrder = () => {
    setTempColumnOrder([...allKeys]);
  };

  useEffect(() => {
    if (open) {
      draggingOrderRef.current = [...columnOrder];
    }
  }, [open, columnOrder]);

  return (
    <>
      <Tooltip title={t("general.columnVisibility")} placement="left">
        <IconButton onClick={handleOpen}>
          <VisibilityOutlinedIcon sx={{ color: "#000" }} />
        </IconButton>
      </Tooltip>
      <GoMakeMenu anchorEl={anchorEl} open={open} handleClose={handleCancel}>
        <Stack direction="row" justifyContent="space-between" px={1} py={0}>
          <PrimaryButton
            variant="text"
            style={classes.topBtns}
            onClick={handleHideAll}
          >
            {t("productionFloor.hideAll")}
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            style={classes.topBtns}
            onClick={handleResetOrder}
          >
            {t("productionFloor.resetOrder")}
          </PrimaryButton>
          <PrimaryButton
            variant="text"
            style={classes.topBtns}
            onClick={handleShowAll}
          >
            {t("productionFloor.showAll")}
          </PrimaryButton>
        </Stack>
        <div className="custom-scrollbar" style={classes.headerContainer}>
          <DndProvider backend={HTML5Backend}>
            {tempColumnOrder?.map((key, index) => (
              <DraggableMenuItem
                key={key}
                id={key}
                index={index}
                label={t(`tableHeaders.${key}`)}
                checked={tempColumnVisibility[key]}
                onToggle={() => handleToggleColumn(key)}
                moveItem={moveItem}
              />
            ))}
          </DndProvider>
        </div>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          p={"0px 8px"}
          mt={1}
        >
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
      </GoMakeMenu>
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
