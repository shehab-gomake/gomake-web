import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Menu } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRecoilValue } from "recoil";
import { productionFloorStatusesState } from "@/widgets/production-floor/state/boards";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useTranslation } from "react-i18next";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useIsMobile } from "@/hooks/use-responsive";

interface IStatusBtnProps {
  id?: string;
  statusId: string;
  onChange?: (id: string, statusId: string) => void;
  isFromMissionView?: boolean;
  currentStation?: string;
  statusColorText?: string;
  statusColorBg?: string;
  statusText?: string;
}

const BoardStatusComponent = ({
  statusId,
  id,
  onChange,
  isFromMissionView = false,
  currentStation,
  statusColorText,
  statusColorBg,
  statusText,
}: IStatusBtnProps) => {
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const canChangeStatus = CheckPermission(
    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  const statuses = useRecoilValue(productionFloorStatusesState);
  const open = Boolean(anchorEl);
  const [menuWidth, setMenuWidth] = useState<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (buttonRef.current) {
      const selectStatusTextWidth =
        buttonRef.current.getBoundingClientRect().width;
      setMenuWidth(selectStatusTextWidth);
    }
  }, [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (canChangeStatus) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelectNewStatus = (statusId: string) => {
    onChange(id, statusId);
    handleClose();
  };

  const boardStatus = useCallback(() => {
    return statuses?.find((status) => status.id === statusId);
  }, [statuses, statusId]);

  const newBgColor = isFromMissionView
    ? statusColorBg
    : boardStatus()?.backgroundColor;

  const newTextColor = isFromMissionView
    ? statusColorText
    : boardStatus()?.textColor;

  return (
    <>
      <Button
        onClick={handleClick}
        ref={buttonRef}
        variant={!!anchorEl ? "outlined" : "contained"}
        sx={{
          borderRadius: "5px",
          backgroundColor: newBgColor,
          border: `1px solid ${newTextColor}`,
          color: newTextColor,
          width: "fit-content",
          minWidth: "fit-content",
          height: isMobile ? 30 : 36,
          pointerEvents: canChangeStatus ? "auto" : "none",
          opacity: 1,
          display: "inline-flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "none",
          padding: "5px 10px",
          lineHeight: "16px",
          ...FONT_FAMILY.Lexend(500, isMobile ? 11 : 13),
          "&:hover": {
            opacity: 0.7,
            backgroundColor: boardStatus()?.backgroundColor,
            color: boardStatus()?.textColor,
          },
          "&.Mui-disabled": {
            backgroundColor: boardStatus()?.backgroundColor,
            color: boardStatus()?.textColor,
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px",
          },
        }}
        disabled={!canChangeStatus}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "max-content" }}>
            {anchorEl
              ? t("customers.selectStatus")
              : isFromMissionView
              ? `${statusText} / ${currentStation}`
              : t("productionStatuses." + boardStatus()?.name)}
          </div>
          {anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </div>
      </Button>
      <Menu
        closeAfterTransition={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ zIndex: 99999999999 }}
        MenuListProps={{
          sx: {
            padding: 0,
            width: menuWidth,
            minWidth: "fit-content",
          },
        }}
      >
        {statuses?.map((status) => (
          <Button
            sx={{
              ...FONT_FAMILY.Lexend(500, isMobile ? 11 : 13),
              width: "100%",
              textTransform: "capitalize",
              justifyContent: "center",
              boxSizing: "border-box",
              display: "flex",
              backgroundColor: status.backgroundColor,
              color: status.textColor,
              borderRadius: 0,
              "&:hover": {
                opacity: 0.7,
                backgroundColor: status.backgroundColor,
                color: status.textColor,
              },
            }}
            onClick={() => onSelectNewStatus(status.id)}
          >
            {t("productionStatuses." + status.name)}
          </Button>
        ))}
      </Menu>
    </>
  );
};

export { BoardStatusComponent };
