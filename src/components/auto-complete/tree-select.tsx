import * as React from "react";
import { styled } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { createGlobalStyle } from "styled-components";
import { useRecoilValue } from "recoil";
import { navStatusState } from "@/store/nav-status";
import { useRouter } from "next/router";
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
    ({ selectedOption, isRequired }: any) => ({
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "40px",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        color: "#000000",
        backgroundColor: "#FFF",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        fontFamily: "Heebo",
        fontStyle: "normal",
        fontWeight: 500,
        lineHeight: "20px",
        border: "transparent !important",
        borderBottom: !isRequired ? "unset !important" : selectedOption
            ? "2px solid rgb(67,195,232) !important"
            : "2px solid rgb(237, 2, 140) !important",
        "& .ant-select-selector": {
            border: "unset !important",
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
        "& .p-placeholder": {
            color: "#B1B1B1",
            opacity: 1,
            fontFamily: "Heebo",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
        },
        "& .p-treeselect-trigger-icon": {
            display: "none",
        },
    })
);

const ClearButton = styled(IconButton)(({ dir }) => ({
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
    const router = useRouter();
    const isHome = router.pathname === "/home"; // Check if the current route is "/home"
    const navStatus = useRecoilValue(navStatusState);
    const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});
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
    `;

    const handleNodeSelect = (e) => {
        const node = e.node;
        if (node.children && node.children.length > 0) {
            const toggler = e.originalEvent.currentTarget.querySelector(".p-tree-toggler");
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
                    <CheckIcon style={{ width: "20px", height: "20px", color: "#2e3092" }} />
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
        const selectedNode = firstLevelTabs.find((item) => item.value === selectedTab);

        return selectedTab === ETab.ALL ? firstLevelTabs.flatMap(item => item?.children) : selectedNode?.children || [];
    }, [selectedTab, options]);


    const onPopupScroll: TreeSelectProps["onPopupScroll"] = (e) => {
    };


    const filterTreeNode = (inputValue, treeNode) => {
        if (!inputValue) return true;
        if (treeNode?.category !== ProductCategoryType.MATERIAL) {
            return treeNode.title.toString().toLowerCase().includes(inputValue.toLowerCase())
        }
        const searchKeywords = inputValue.toString().toLowerCase().split(" ").filter(Boolean);
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
        return pathTexts.map((text) => (typeof text === 'string' ? text.toLowerCase() : ''));
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
                placeholder={t("modal.pleaseSelect")}
                allowClear
                onChange={onChange}
                isRequired={isRequired}
                treeData={filteredTreeData}
                onPopupScroll={onPopupScroll}
                filterTreeNode={filterTreeNode}
                dropdownRender={(menu) => (
                    <div>
                        <UnderlinedTabs
                            selectedColor={'primary'}
                            value={selectedTab}
                            onChange={(e, newValue) => setSelectedTab(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            style={{ marginBottom: "10px" }}
                        >
                            {
                                hideOtherTabs && selectedTab !== ETab.PRODUCTS ? <></> : <UnderlinedTab selectedColor={'primary'} key={'products'} label={t("tabs.products")}
                                    value={ETab.PRODUCTS} />
                            }
                            {
                                hideOtherTabs && selectedTab !== ETab.MATERIALS ? <></> : <UnderlinedTab selectedColor={'primary'} key={'materials'} label={t("tabs.materials")}
                                    value={ETab.MATERIALS} />
                            }
                            {
                                hideOtherTabs && selectedTab !== ETab.ALL ? <></> : <UnderlinedTab selectedColor={'primary'} key={'all'} label={t('navigationButtons.all')} value={ETab.ALL} />
                            }
                        </UnderlinedTabs>
                        {menu}
                    </div>
                )}
            />
            {selectedNodeKey && (
                <ClearButton dir={dir} onClick={handleClear}>
                    <ClearIcon sx={{ width: "20px", height: "20px" }} />
                </ClearButton>
            )}
        </div>
    );
};

export { GoMakeTreeSelect };
