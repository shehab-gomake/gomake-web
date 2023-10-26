import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { EditRulesModal } from "../properties-modals/edit-rule-modal";
import { userState } from "@/store";
import { useState } from "react";
import { AddNewRuleModal } from "../properties-modals/add-new-rule-modal";
import { useRecoilState } from "recoil";
import { addRuleState } from "@/store/add-rule";
interface IMoreMenuWidget{
  rules: [],
  actionId:string,
  propertyId:string,
  ruleType:number
}
const MoreMenuWidget = ({rules,actionId, propertyId, ruleType}) => {
  const { clasess } = useStyle();
  const [openRules,setOpenRules] = useState<boolean>(false);
  const [openAddNewRule,setOpenNewRule] = useRecoilState<boolean>(addRuleState);

  const { open, anchorEl, menuList, handleClose, handleClick } =
    useMoreCircle();
  const onCloseModal = ()=> {
    setOpenRules(false);
  }
  const onCloseNewRuleModal = ()=> {
    setOpenNewRule(false)
  }
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {menuList?.map((item, index) => {
          return (
            <>
              <MenuItem
                style={clasess.menuItemContainer}
                key={index}
                onClick={()=> {if(index == 0) {setOpenRules(true)} else {setOpenNewRule(true)}}}
              >
                {item?.icon}
                <div style={clasess.menuTitleStyle}>{item?.name}</div>
              </MenuItem>
              {index != menuList?.length - 1 ? (
                <div style={clasess.lineStyle} />
              ) : null}
            </>
          );
        })}
      </GoMakeMenu>
      </>
  );
};
export { MoreMenuWidget };
