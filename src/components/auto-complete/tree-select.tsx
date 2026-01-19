import * as React from "react";
import { styled } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";
import { createGlobalStyle } from "styled-components";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ProductIcon } from "./icons";
import { useStyle } from "./style";
import CheckIcon from "@mui/icons-material/Check";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { TreeSelect, TreeSelectProps } from "antd";
import { UnderlinedTab, UnderlinedTabs } from "@/components/tabs/primary-tabs";
import { ETab } from "@/pages-components/admin/home/widgets/quote-widget/enums";
import { ProductCategoryType } from "@/pages-components/admin/home/widgets/quote-widget/states";

// Styled components for TreeSelect and Clear Button
const StyledTreeSelect = styled<any>(TreeSelect)(
  ({ selectedOption, isRequired, dir, hasValue }: any) => ({
    boxSizing: "border-box",
    borderRadius: "var(--theme-dropdown-border-radius, 4px)",
    height: "40px",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    color: "#000000",
    backgroundColor: "#FFF",
    boxShadow: "var(--theme-dropdown-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "20px",
    border: "none !important", // Remove wrapper border to prevent double border
    borderBottom: !isRequired
      ? "unset !important"
      : selectedOption
      ? "2px solid rgb(67,195,232) !important"
      : "2px solid rgb(237, 2, 140) !important",
    "& .ant-select-selector": {
      border: "1px solid var(--theme-dropdown-border-color, transparent) !important",
      borderRadius: "var(--theme-dropdown-border-radius, 4px) !important",
      display: "flex !important",
      alignItems: "center !important",
    },
    "&.ant-select-focused .ant-select-selector": {
      borderColor: "var(--theme-dropdown-border-color, transparent) !important",
      borderWidth: "1px !important",
      borderStyle: "solid !important",
      boxShadow:
        "var(--theme-dropdown-shadow, 0 0 0 2px rgba(224, 224, 224, 0.2)) !important",
    },
    "& .p-dropdown-label": {
      padding: 0,
      direction: "ltr",
      fontFamily: "Heebo",
      fontStyle: "normal",
      fontWeight: 500,
    },
    "& .ant-select-dropdown": {
      zIndex: 999999999999,
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
      padding: "4px 10px",
    },
    "& .ant-select-selection-placeholder": {
      color: "var(--theme-dropdown-placeholder-color, #B1B1B1) !important",
      opacity: "1 !important",
      fontFamily: "Heebo !important",
      fontStyle: "normal !important",
      fontWeight: "var(--theme-dropdown-placeholder-weight, 500) !important",
      fontSize: "var(--theme-dropdown-placeholder-size, 12px) !important",
    },
    "& .p-treeselect-trigger-icon": {
      display: "none",
    },
    "& .ant-select-clear": {
      ...(dir === "rtl"
        ? { left: "8px", right: "auto" }
        : { right: "8px", left: "auto" }),
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      lineHeight: "1",
      marginTop: "0",
      position: "absolute",
    },
    "& .ant-select-selection-item": {
      ...(dir === "rtl"
        ? { paddingLeft: "24px !important" }
        : { paddingRight: "24px !important" }),
    },
  })
);

const CustomClearIcon = () => (
  <ClearIcon
    sx={{ width: "18px", height: "18px", color: "rgba(0, 0, 0, 0.54)" }}
  />
);

const CustomArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.5">
      <path
        d="M4 6L8 10L12 6"
        stroke="#A3A3A3"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

const GoMakeTreeSelect = ({
  value,
  onChange,
  options,
  placeholder,
  style,
  selectedTab,
  setSelectedTab,
  isRequired,
  hideOtherTabs,
  ...props
}: {
  value?: any;
  onChange?: (e: { value: any }) => void;
  options: any[];
  placeholder?: string;
  style?: React.CSSProperties;
  selectedTab?: any;
  isRequired?: boolean;
  hideOtherTabs?: boolean;
  setSelectedTab: (value: any) => void;
}) => {
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);

  const treeSelectRef = React.useRef(null);
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { classes } = useStyle();

  const GlobalStyle = createGlobalStyle`
        .ant-select-tree-node-content-wrapper {
            &:hover {
                background-color: transparent !important;
            }
        }

        .p-tree-container {
            width: 100%;
        }

        .p-treenode {
            padding: ${RTL ? "0px 5px 5px 0px" : "0px 0px 5px 5px"};
        }

        .p-tree .p-tree-container > .p-treenode > .p-treenode-content {
            display: flex;
            justify-content: space-between;
            flex-direction: row-reverse;
        }

        .p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler {
            transform: ${RTL ? "rotate(180deg)" : "none"};
            max-width: 450px;
        }

        .p-treeselect-panel .p-treeselect-header .p-treeselect-filter-container .p-treeselect-filter-icon {
            position: absolute;
            ${RTL ? "left: 10px; right: unset;" : "right: 10px;"}
            top: 50%;
            transform: translateY(-50%);
        }

        .editorDiv .ant-select-selector {
            border: 1px solid var(--theme-dropdown-border-color, transparent) !important;
        }
        
        .editorDiv .ant-select-focused .ant-select-selector {
            border-color: var(--theme-dropdown-border-color, transparent) !important;
            border-width: 1px !important;
            border-style: solid !important;
            box-shadow: var(--theme-dropdown-shadow, 0 0 0 2px rgba(224, 224, 224, 0.2)) !important;
        }
        
        .editorDiv .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
            border-color: var(--theme-dropdown-border-color, transparent) !important;
            border-width: 1px !important;
            border-style: solid !important;
        }

        .editorDiv .ant-select:not(.ant-select-disabled) .ant-select-selector:has(.ant-select-selection-item) {
            border-color: var(--theme-dropdown-border-color, transparent) !important;
            border-width: 1px !important;
            border-style: solid !important;
        }
    `;

  // const ClearButton = styled(IconButton)(({ dir }) => ({
  //   position: "absolute",
  //   [dir === "rtl" ? "left" : "right"]: "8px",
  //   top: "50%",
  //   transform: "translateY(-50%)",
  //   padding: "4px",
  //   zIndex: 1,
  // }));

  // const handleClear = () => {
  //   setSelectedNodeKey(null);
  //   if (onChange) {
  //     onChange({ value: null });
  //   }
  // };

  // Update selectedNodeKey when value changes
  useEffect(() => {
    if (value?.id) {
      setSelectedNodeKey(value.id);
    } else {
      setSelectedNodeKey(null);
    }
  }, [value]);

  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
    },
  });

  const getLabel = (label) => {
    if (label && label.length > 48) {
      let shortLabel = label.substring(0, 48);
      let lastSpace = shortLabel.lastIndexOf(" ");
      shortLabel = shortLabel.substring(0, lastSpace) + "...";
      return (
        <div>
          <CustomWidthTooltip
            title={label}
            placement="right"
            arrow
            style={{ maxWidth: 500 }}
          >
            <span>{shortLabel}</span>
          </CustomWidthTooltip>
        </div>
      );
    }
    return label;
  };

  const nodeTemplate = (node) => {
    const isFirstLevel = node.level === 0;
    const isSelected = selectedNodeKey === node.value;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: isSelected && (RTL ? "0px 0px 0px 5px" : "0px 5px 0px 0px"),
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {isFirstLevel && <ProductIcon />}
          <span
            style={
              isFirstLevel ? classes.firstLevelLabel : classes.otherLevelsLabel
            }
          >
            {getLabel(node.title)}
          </span>
        </div>
        {isSelected && (
          <CheckIcon
            style={{ width: "20px", height: "20px", color: "var(--theme-primary-color, #2E3092)" }}
          />
        )}
      </div>
    );
  };

  // Recursive function for preparing tree data
  const rec = (option) => {
    if (!option.isProcessed) {
      option.title = nodeTemplate(option);
      option.isProcessed = true;
    }

    if (option.children && option.children.length > 0) {
      for (let i = 0; i < option.children.length; i++) {
        rec(option.children[i]);
      }
    }
  };

  const firstLevelTabs = options.map((item) => ({
    value: item.value,
    title: item.title,
    children: item.children,
  }));

  // Filter tree data based on selected tab
  const filteredTreeData = useMemo(() => {
    const selectedNode = firstLevelTabs.find(
      (item) => item.value === selectedTab
    );

    return selectedTab === ETab.ALL
      ? firstLevelTabs.flatMap((item) => item?.children)
      : selectedNode?.children || [];
  }, [selectedTab, options]);

  const onPopupScroll: TreeSelectProps["onPopupScroll"] = (e) => {};

  const filterTreeNode = (inputValue, treeNode) => {
    if (!inputValue) return true;
    if (treeNode?.category !== ProductCategoryType.MATERIAL) {
      return treeNode.title
        .toString()
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    }
    const searchKeywords = inputValue
      .toString()
      .toLowerCase()
      .split(" ")
      .filter(Boolean);
    const pathTexts = getNodePathText(treeNode);

    let keywordIndex = 0;
    for (let i = 0; i < pathTexts.length; i++) {
      if (pathTexts[i].includes(searchKeywords[keywordIndex])) {
        keywordIndex++;
        if (keywordIndex === searchKeywords.length) {
          return true;
        }
      }
    }
    return false;
  };

  const getNodePathText = (node) => {
    let current = node;
    const pathTexts = [];
    while (current) {
      pathTexts.unshift(current.title?.props?.children || current.title);
      current = current.parent;
    }
    return pathTexts.map((text) =>
      typeof text === "string" ? text.toLowerCase() : ""
    );
  };
  return (
    <div className="editorDiv" style={{ position: "relative", width: "100%" }}>
      <GlobalStyle />
      <StyledTreeSelect
        ref={treeSelectRef}
        key={"ProductSelect"}
        showSearch
        style={{ width: "100%" }}
        value={value?.id}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder={placeholder || t("modal.pleaseSelect")}
        allowClear
        onChange={onChange}
        isRequired={isRequired}
        treeData={filteredTreeData}
        onPopupScroll={onPopupScroll}
        filterTreeNode={filterTreeNode}
        suffixIcon={<CustomArrowIcon />}
        clearIcon={<CustomClearIcon />}
        dir={dir}
        hasValue={!!value?.id}
        dropdownRender={(menu) => (
          <div>
            <UnderlinedTabs
              selectedColor={"primary"}
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              style={{ marginBottom: "10px" }}
            >
              {hideOtherTabs && selectedTab !== ETab.PRODUCTS ? (
                <></>
              ) : (
                <UnderlinedTab
                  selectedColor={"primary"}
                  key={"products"}
                  label={t("tabs.products")}
                  value={ETab.PRODUCTS}
                />
              )}
              {hideOtherTabs && selectedTab !== ETab.MATERIALS ? (
                <></>
              ) : (
                <UnderlinedTab
                  selectedColor={"primary"}
                  key={"materials"}
                  label={t("tabs.materials")}
                  value={ETab.MATERIALS}
                />
              )}
              {hideOtherTabs && selectedTab !== ETab.ALL ? (
                <></>
              ) : (
                <UnderlinedTab
                  selectedColor={"primary"}
                  key={"all"}
                  label={t("navigationButtons.all")}
                  value={ETab.ALL}
                />
              )}
            </UnderlinedTabs>
            {menu}
          </div>
        )}
      />
      {/* {selectedNodeKey && (
        <ClearButton dir={dir} onClick={handleClear}>
          <ClearIcon sx={{ width: "20px", height: "20px" }} />
        </ClearButton>
      )} */}
    </div>
  );
};

export { GoMakeTreeSelect };
