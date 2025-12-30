import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  Collapse,
  Typography,
  Paper,
  Popper,
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { PrimaryCheckbox } from "../check-box/primary-check-box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { FONT_FAMILY } from "@/utils/font-family";

export interface AccountItem {
  code: string; // accountKey
  name: string; // accountName
  sortCode?: string;
  sortName?: string;
  balance?: number;
  bankAccountNUM?: string | null;
  bankBranch?: string | null;
  bankName?: string | null;
  cpaAcount?: string | null;
  isSelected?: boolean;
}

export interface NestedCheckboxGroup {
  sortCode: string;
  sortName: string;
  children: AccountItem[];
}

export interface NestedCheckboxProps {
  groups: NestedCheckboxGroup[];
  selectedCodes: string[];
  onChange: (selectedCodes: string[]) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  maxHeight?: string | number;
}

const StyledTextField = styled(TextField)(({ theme, dir }: any) => ({
  "& .MuiOutlinedInput-root": {
    height: 40,
    fontFamily: "Heebo",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    backgroundColor: "#FFF",
    boxShadow: "var(--theme-dropdown-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
    borderRadius: "var(--theme-dropdown-border-radius, 4px)",
    direction: dir,
    "& fieldset": {
      border: "var(--theme-dropdown-border, 1px solid transparent)",
      borderColor: "var(--theme-dropdown-border-color, transparent)",
    },
    "&:hover fieldset": {
      borderColor: "var(--theme-dropdown-border-color, transparent) !important",
      borderWidth: "1px !important",
      borderStyle: "solid !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--theme-dropdown-border-color, transparent) !important",
      borderWidth: "1px !important",
      borderStyle: "solid !important",
    },
    "& input": {
      cursor: "pointer",
      padding: "0px 8px",
      "&::placeholder": {
        color: "var(--theme-dropdown-placeholder-color, #B1B1B1)",
        opacity: 1,
        ...FONT_FAMILY.Heebo(500, 12),
      },
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: "4px",
  boxShadow: "var(--theme-dropdown-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
  borderRadius: "var(--theme-dropdown-border-radius, 4px)",
  border: "1px solid var(--theme-dropdown-border-color, #E5E7EB)",
  maxHeight: "400px",
  overflow: "hidden",
  zIndex: 1300,
  minWidth: "100%",
  width: "100%",
}));

const NestedCheckbox: React.FC<NestedCheckboxProps> = ({
  groups,
  selectedCodes,
  onChange,
  placeholder = "Select accounts",
  style,
  maxHeight = "400px",
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get display text for selected items
  const displayText = useMemo(() => {
    if (selectedCodes.length === 0) {
      return "";
    }
    if (selectedCodes.length === 1) {
      // Find the selected item
      for (const group of groups) {
        const item = group.children.find(
          (child) => child.code === selectedCodes[0]
        );
        if (item) {
          return `${item.code} - ${item.name}`;
        }
      }
      return selectedCodes[0];
    }
    return `${selectedCodes.length} ${
      t("general.itemsSelected") || "items selected"
    }`;
  }, [selectedCodes, groups, t]);

  const toggleGroup = useCallback((sortCode: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(sortCode)) {
        next.delete(sortCode);
      } else {
        next.add(sortCode);
      }
      return next;
    });
  }, []);

  const handleParentCheckboxChange = useCallback(
    (group: NestedCheckboxGroup, checked: boolean) => {
      const groupCodes = group.children.map((child) => child.code);
      if (checked) {
        // Add all children codes (remove duplicates)
        const allCodes = [...selectedCodes, ...groupCodes];
        onChange(Array.from(new Set(allCodes)));
      } else {
        // Remove all children codes
        onChange(selectedCodes.filter((code) => !groupCodes.includes(code)));
      }
    },
    [selectedCodes, onChange]
  );

  const handleChildCheckboxChange = useCallback(
    (code: string, checked: boolean) => {
      if (checked) {
        onChange([...selectedCodes, code]);
      } else {
        onChange(selectedCodes.filter((c) => c !== code));
      }
    },
    [selectedCodes, onChange]
  );

  const isGroupFullySelected = useCallback(
    (group: NestedCheckboxGroup) => {
      return group.children.every((child) =>
        selectedCodes.includes(child.code)
      );
    },
    [selectedCodes]
  );

  const isGroupPartiallySelected = useCallback(
    (group: NestedCheckboxGroup) => {
      const selectedCount = group.children.filter((child) =>
        selectedCodes.includes(child.code)
      ).length;
      return selectedCount > 0 && selectedCount < group.children.length;
    },
    [selectedCodes]
  );

  // Check if all items are selected
  const areAllItemsSelected = useMemo(() => {
    const totalItems = groups.reduce(
      (sum, group) => sum + group.children.length,
      0
    );
    return totalItems > 0 && selectedCodes.length === totalItems;
  }, [groups, selectedCodes]);

  // Check if some items are selected (partial selection)
  const areSomeItemsSelected = useMemo(() => {
    return selectedCodes.length > 0 && !areAllItemsSelected;
  }, [selectedCodes.length, areAllItemsSelected]);

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allCodes = groups.flatMap((group) =>
          group.children.map((child) => child.code)
        );
        onChange(allCodes);
      } else {
        onChange([]);
      }
    },
    [groups, onChange]
  );

  // Handle expand all / collapse all
  const handleExpandAll = useCallback(() => {
    setExpandedGroups(new Set(groups.map((g) => g.sortCode)));
  }, [groups]);

  const handleCollapseAll = useCallback(() => {
    setExpandedGroups(new Set());
  }, []);

  const allExpanded = useMemo(() => {
    return groups.length > 0 && expandedGroups.size === groups.length;
  }, [groups.length, expandedGroups.size]);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange]
  );

  const handleInputClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box ref={anchorRef} sx={{ position: "relative", width: "100%", ...style }}>
      <StyledTextField
        dir={dir}
        fullWidth
        inputRef={inputRef}
        value={displayText}
        placeholder={placeholder}
        onClick={handleInputClick}
        inputProps={{
          readOnly: true,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position={isRTL ? "start" : "end"}>
              {selectedCodes.length > 0 && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{
                    marginRight: isRTL ? 0 : "4px",
                    marginLeft: isRTL ? "4px" : 0,
                  }}
                >
                  <ClearIcon
                    sx={{ fontSize: 18, color: "rgba(0, 0, 0, 0.54)" }}
                  />
                </IconButton>
              )}
              <ArrowDropDownIcon
                sx={{
                  fontSize: 20,
                  color: "rgba(0, 0, 0, 0.54)",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement={isRTL ? "bottom-end" : "bottom-start"}
        style={{
          width: Math.max(anchorRef.current?.offsetWidth || 200, 350),
          minWidth: 350,
          zIndex: 1300,
        }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <StyledPaper
            sx={{
              width: Math.max(anchorRef.current?.offsetWidth || 200, 350),
              minWidth: 350,
              maxWidth: "90vw",
            }}
          >
            <Box
              sx={{
                maxHeight,
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "#FFFFFF",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {groups.length === 0 ? (
                <Box
                  sx={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  <Typography variant="body2">
                    {t("general.noOptions") || "No options available"}
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Select All and Expand/Collapse Controls */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      borderBottom: "1px solid #E5E7EB",
                      backgroundColor: "#FAFBFC",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <PrimaryCheckbox
                        checked={areAllItemsSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        inputProps={{
                          "aria-label": "Select all",
                        }}
                        color={areSomeItemsSelected ? "#9CA3AF" : "#2E3092"}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          marginLeft: isRTL ? 0 : "4px",
                          marginRight: isRTL ? "4px" : 0,
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#1F2937",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelectAll(!areAllItemsSelected)}
                      >
                        {t("productionFloor.selectAll") || "Select All"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                      }}
                    >
                      {allExpanded ? (
                        <IconButton
                          size="small"
                          onClick={handleCollapseAll}
                          sx={{
                            padding: "2px",
                            minWidth: "24px",
                            width: "24px",
                            height: "24px",
                            color: "#6B7280",
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                            },
                          }}
                          title={
                            t("productionReport.collapseAll") || "Collapse All"
                          }
                        >
                          <ExpandLessIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={handleExpandAll}
                          sx={{
                            padding: "2px",
                            minWidth: "24px",
                            width: "24px",
                            height: "24px",
                            color: "#6B7280",
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                            },
                          }}
                          title={
                            t("productionReport.expandAll") || "Expand All"
                          }
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ padding: "6px" }}>
                    {groups.map((group) => {
                      const isExpanded = expandedGroups.has(group.sortCode);
                      const isFullySelected = isGroupFullySelected(group);
                      const isPartiallySelected =
                        isGroupPartiallySelected(group);
                      const parentLabel = `${group.sortCode} - ${group.sortName}`;

                      return (
                        <Box key={group.sortCode} sx={{ marginBottom: "4px" }}>
                          {/* Parent Group Header */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              padding: "6px 8px",
                              backgroundColor: isFullySelected
                                ? "#F3F4F6"
                                : isPartiallySelected
                                ? "#F9FAFB"
                                : "transparent",
                              borderRadius: "4px",
                              cursor: "pointer",
                              width: "100%",
                              boxSizing: "border-box",
                              "&:hover": {
                                backgroundColor: "#F9FAFB",
                              },
                            }}
                            onClick={() => toggleGroup(group.sortCode)}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleGroup(group.sortCode);
                              }}
                              sx={{
                                padding: "2px",
                                minWidth: "24px",
                                width: "24px",
                                height: "24px",
                                ...(isRTL
                                  ? { marginLeft: "4px" }
                                  : { marginRight: "4px" }),
                              }}
                            >
                              {isExpanded ? (
                                <ExpandLessIcon fontSize="small" />
                              ) : (
                                <ExpandMoreIcon fontSize="small" />
                              )}
                            </IconButton>

                            <PrimaryCheckbox
                              checked={isFullySelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleParentCheckboxChange(
                                  group,
                                  e.target.checked
                                );
                              }}
                              inputProps={{
                                "aria-label": `Select all ${parentLabel}`,
                              }}
                              color={
                                isPartiallySelected ? "#9CA3AF" : "#2E3092"
                              }
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                ...(isRTL
                                  ? { marginRight: "4px" }
                                  : { marginLeft: "4px" }),
                                fontWeight: 500,
                                fontSize: "14px",
                                color: "#1F2937",
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {parentLabel}
                            </Typography>
                          </Box>

                          {/* Children */}
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                ...(isRTL
                                  ? { paddingRight: "32px" }
                                  : { paddingLeft: "32px" }),
                                paddingTop: "2px",
                              }}
                            >
                              {group.children.map((child) => {
                                const isSelected = selectedCodes.includes(
                                  child.code
                                );
                                const childLabel = `${child.code} - ${child.name}`;

                                return (
                                  <Box
                                    key={child.code}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      width: "100%",
                                      boxSizing: "border-box",
                                      "&:hover": {
                                        backgroundColor: "#F9FAFB",
                                      },
                                    }}
                                  >
                                    <PrimaryCheckbox
                                      checked={isSelected}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleChildCheckboxChange(
                                          child.code,
                                          e.target.checked
                                        );
                                      }}
                                      inputProps={{
                                        "aria-label": `Select ${childLabel}`,
                                      }}
                                    />

                                    <Typography
                                      variant="body2"
                                      sx={{
                                        ...(isRTL
                                          ? { marginRight: "4px" }
                                          : { marginLeft: "4px" }),
                                        fontSize: "13px",
                                        color: "#374151",
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {childLabel}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Collapse>
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
            </Box>
          </StyledPaper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export { NestedCheckbox };
