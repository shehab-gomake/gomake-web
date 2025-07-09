import { Menu } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Children, cloneElement, isValidElement, ReactElement } from "react";

interface GoMakeMenuProps {
  handleClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
  children: ReactElement | ReactElement[]; // Define the type of children
  style?: React.CSSProperties;
  sx?: object;
  noListPadding?: boolean;
  menuOffsetY?: number | string;
}

const GoMakeMenu = ({
  handleClose,
  open,
  anchorEl,
  children,
  style,
  sx,
  noListPadding = false,
  menuOffsetY,
}: GoMakeMenuProps) => {
  const { t } = useTranslation();
  const direction = t("direction");

  return (
    <Menu
      anchorReference="anchorEl"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={
        direction === "rtl"
          ? { vertical: "bottom", horizontal: "left" }
          : { vertical: "bottom", horizontal: "right" }
      }
      transformOrigin={
        direction === "rtl"
          ? { vertical: "top", horizontal: "left" }
          : { vertical: "top", horizontal: "right" }
      }
      style={style}
      sx={sx}
      {...(noListPadding && {
        MenuListProps: {
          sx: {
            padding: 0,
          },
        },
      })}
      PaperProps={{
        sx: {
          ...(menuOffsetY !== undefined && { mt: menuOffsetY }), // 👈 only apply if defined
        },
      }}
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement, {
              onKeyDown: (event: React.KeyboardEvent) => {
                event.stopPropagation();
              },
            })
          : null
      )}
    </Menu>
  );
};

export { GoMakeMenu };
