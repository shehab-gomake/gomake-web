import * as React from "react";
import { TreeSelect } from 'primereact/treeselect';
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalStyles } from "@mui/material";

const StyledTreeSelect = styled(TreeSelect)(({ theme }) => ({
  direction: "ltr",
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  fontFamily: "Lexend",
  fontStyle: "normal",
  fontWeight: 300,
  fontSize: "14px",
  lineHeight: "21px",
  display: "flex",
  alignItems: "center",
  color: "#000000",
  backgroundColor: "#FFF",
  borderBottom: "2px solid rgb(67,195,232)",
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
  "& .p-dropdown-label": {
    padding: 0,
    direction: "ltr",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
  },
  "& .p-dropdown": {
    height: "40px",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    width: "100%",
  },
  "& .p-dropdown-empty-message": {
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
  },

  "& .p-treeselect-label-container": {
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    paddingLeft: "15px!important",
  },
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
    const [selectedNodeKey, setSelectedNodeKey] = useState<any>(value);
  
    const handleChange = (e: { value: any }) => {
      setSelectedNodeKey(e.value);
      if (onChange) {
        onChange(e);
      }
    };
  
    return (
      <StyledTreeSelect
        value={selectedNodeKey}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        style={style}
        {...props}
      />
    );
  };
  
export { GoMakeTreeSelect };
