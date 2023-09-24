import { useState } from "react";
import { EditMenuIcon } from "./icons/edit-menu";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { propertyState } from "../property";
import { AddPlusIcon } from "@/icons";

const useMoreCircle = () => {
  const propertyStateValue = useRecoilValue<any>(propertyState);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuList = [
    {
      name: t("properties.editRules"),
      icon: <EditMenuIcon />,
    },
    {
      name: t("properties.addRule"),
      icon: <AddPlusIcon />,
      onclick: () => null,
    },
  ];

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
