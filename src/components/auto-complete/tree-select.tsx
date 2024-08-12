import * as React from "react";
import { TreeSelect } from 'primereact/treeselect';
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from '@mui/icons-material/Clear'; // Import a clear icon
import IconButton from "@mui/material/IconButton";

const StyledTreeSelect = styled(TreeSelect)(({ theme, dir }) => ({
  boxSizing: "border-box",
  borderRadius: "4px",
  height: "40px",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  color: "#000000",
  backgroundColor: "#FFF",
  boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
  padding: '4px 10px',
  fontFamily: "Heebo",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "20px",
  border: "transparent !important", 
  borderBottom: "2px solid rgb(67,195,232) !important",
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
  position: "relative",
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
    const { t } = useTranslation();
    const dir: 'rtl' | 'ltr' = t('direction');
    const RTL = dir === 'rtl';

    const [selectedNodeKey, setSelectedNodeKey] = useState<any>(value);
  
    const handleChange = (e: { value: any }) => {
      setSelectedNodeKey(e.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleClear = () => {
      setSelectedNodeKey(null);
      if (onChange) {
        onChange({ value: null });
      }
    };

    return (
      <div className='editorDiv' style={{ position: 'relative', width: '100%' }}>
        <style jsx global>{`
           .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
            transform: ${RTL? "rotate(180deg)" : "none"};
          }
            `}</style>
        <StyledTreeSelect
          value={selectedNodeKey}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          style={style}
          {...props}
          dir={dir}
          filter 
        />
        {selectedNodeKey && (
          <ClearButton dir={dir} onClick={handleClear}>
            <ClearIcon />
          </ClearButton>
        )}
      </div>
    );
  };
  
export { GoMakeTreeSelect };
