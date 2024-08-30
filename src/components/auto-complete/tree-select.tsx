import * as React from "react";
//import { TreeSelect } from 'primereact/treeselect';
import { styled } from "@mui/material/styles";
import {useMemo, useState} from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from "@mui/material/IconButton";
import { createGlobalStyle } from "styled-components";
import { useRecoilValue } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { useRouter } from "next/router";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ProductIcon } from "./icons";
import { useStyle } from "./style";
import CheckIcon from '@mui/icons-material/Check';
import {Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import {TreeSelect, TreeSelectProps} from "antd";
const StyledTreeSelect = styled(TreeSelect)(({ theme, dir, selectedOption }: any) => ({
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  color: "#000000",
  backgroundColor: "#FFF",
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
  // padding: '4px 10px',
  fontFamily: "Heebo",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px",
  border: "transparent !important",
  borderBottom: selectedOption
    ? "2px solid rgb(67,195,232) !important"
    : "2px solid rgb(237, 2, 140) !important",
  "& .ant-select-selector":{
    border:'unset !important'
  },
  "& .p-dropdown-label": {
    padding: 0,
    direction: "ltr",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
  },
  "& .p-tree-container": {
    width: "100%",
  },
  "& .p-dropdown": {
    height: "40px",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    width: "100%",
  },
  "& .p-treeselect-label-container": {
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    padding: '4px 10px',
  },
  "& .p-placeholder": {
    color: "#B1B1B1",
    opacity: 1,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
  },
  // arrow icon
  "& .p-treeselect-trigger-icon": {
    display: "none",
  },
  // clear button container

}));

const ClearButton = styled(IconButton)(({ theme, dir }) => ({
  position: "absolute",
  [dir === "rtl" ? "left" : "right"]: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "4px",
  zIndex: 1,
}));

const GoMakeTreeSelect = ({
  value,
  onChange,
  options,
  placeholder,
  style,
  ...props
}: {
  value?: any;
  onChange?: (e: { value: any }) => void;
  options: any[];
  placeholder?: string;
  style?: React.CSSProperties;
}) => {
  const router = useRouter();
  const isHome = router.pathname === "/home"; // Check if the current route is "/home"
  const navStatus = useRecoilValue(navStatusState);
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
  const treeSelectRef = React.useRef(null);
  const { t } = useTranslation();
  const dir: 'rtl' | 'ltr' = t('direction');
  const RTL = dir === 'rtl';
  const { classes } = useStyle();

  const GlobalStyle = createGlobalStyle`
  .p-tree-container {
      width:100%;
  },
 .p-treenode {
  padding: ${RTL ? "0px 5px 5px 0px" : "0px 0px 5px 5px"};
  },
  .p-tree .p-tree-container > .p-treenode > .p-treenode-content {
     display: 'flex';
     justify-content: space-between;
     flex-direction: row-reverse;
  },
  .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
     transform: ${RTL ? "rotate(180deg)" : "none"};
     max-width: 450px;
   },
   .p-treeselect-panel .p-treeselect-header .p-treeselect-filter-container .p-treeselect-filter-icon {
  position: absolute;
  ${RTL ? "left: 10px; right:unset" : "right: 10px;"};
  top: 50%;
  transform: translateY(-50%);
},
`;

  const handleNodeSelect = (e) => {
    const node = e.node;
    if (node.children && node.children.length > 0) {
      const toggler = e.originalEvent.currentTarget.querySelector('.p-tree-toggler');
      if (toggler) {
        toggler.click();
      }
      setTimeout(() => {
        treeSelectRef.current.show();
      }, 0);
    } else {
      setSelectedNodeKey(node.key);
      if (onChange) {
        onChange({ value: node.key });
      }
    }
  };

  const handleClear = () => {
    setSelectedNodeKey(null);
    if (onChange) {
      onChange({ value: null });
    }
  };
  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
    },
  });

  const getLabel = (label) => {
    if(label && label.length > 48){
      let shortLabel = label.substring(0,48);
      let lastSpace =  shortLabel.lastIndexOf(" ");
      shortLabel = shortLabel.substring(0,lastSpace) + "..."
      return <div>
        <CustomWidthTooltip  title={label} placement="right" arrow  style={{maxWidth:500}}>
          <span>{shortLabel}</span>
        </CustomWidthTooltip>
      </div>
    }
    return label;
  }
  const nodeTemplate = (node) => {
    const isFirstLevel = node.level === 0;
    const isSelected = selectedNodeKey === node.value;  

    return (
      <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' , padding: isSelected && (RTL ?  "0px 0px 0px 5px" :"0px 5px 0px 0px")}}>
        <div style={{ display: 'flex', alignItems: 'center',  }}>
          {isFirstLevel && <ProductIcon />}
          <span style={isFirstLevel ? classes.firstLevelLabel : classes.otherLevelsLabel}>
            {getLabel(node.title)}
          </span>
        </div>
        {isSelected && <CheckIcon style={{ width: "20px", height: "20px" , color:"#2e3092" }} />}
      </div>
    );
  };
  const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
    console.log('onPopupScroll', e);
  };
  
  
  const rec = (option)=>{
    option.title = nodeTemplate(option);
    if(option.children && option.children.length > 0){
       for(let i = 0;i < option.children.length ;i++){
         rec(option.children[i]);
       }
    }
  }
  const treeData = useMemo(()=>{
    for(let i = 0;i<options.length;i++){
      let option = options[i];
      rec(option);
    }
    return options;
  },[options])
  return (
    <div className='editorDiv' style={{ position: 'relative', width: '100%' }}>
      <GlobalStyle />
      <StyledTreeSelect
        ref={treeSelectRef}
        key={"ProductSelect"}
        showSearch
        style={{ width: '100%' }}
        //value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        onChange={onChange}
        treeData={treeData}
        onPopupScroll={onPopupScroll}
        filterTreeNode={(input, treeNode) => {
          if(input === "100"){
            debugger
          }
          return treeNode.text.toString().includes(input);
          
        }}
      />
      {selectedNodeKey && (
        <ClearButton dir={dir} onClick={handleClear}>
          <ClearIcon sx={{
            width: "20px",
            height: "20px",
          }} />
        </ClearButton>
      )}
    </div>
  );
};

export { GoMakeTreeSelect };
