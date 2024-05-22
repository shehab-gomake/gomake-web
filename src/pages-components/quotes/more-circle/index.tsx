import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";

const MoreMenuWidget = ({
  quote,
  documentType,
  onClickOpenModal,
  onClickPdf,
  onClickDuplicate,
  onClickLoggers,
  onClickOpenIrrelevantModal,
  onClickOpenDeliveryTimeModal,
  onClickOpenPriceModal,
  CloseDocument
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getMenuList } = useMoreCircle();
  const menuList = getMenuList({
    quote,
    documentType,
    onClickOpenModal,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    t,
    onClickOpenIrrelevantModal,
    onClickOpenDeliveryTimeModal,
    onClickOpenPriceModal,
    CloseDocument
  });

  return (
    <OptionsButton >
      {menuList.map((item, index) => (
        item.condition && (
          <MenuItem style={classes.menuRowStyle} key={index} onClick={item.onClick}>
            {item.icon}
            <div style={classes.rowTextStyle}>{item.name}</div>
          </MenuItem>
        )
      ))}
    </OptionsButton>
  );
};

export { MoreMenuWidget };