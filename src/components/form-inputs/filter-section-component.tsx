import { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-responsive";

interface IFilterItem {
  id: string;
  label: string;
  component: React.ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl";
}

interface IEnhancedFilterSectionProps {
  filters: IFilterItem[];
  hasActiveFilters?: boolean;
  actionButtons?: React.ReactNode;
  tableActionButtons?: React.ReactNode;
  title?: string;
}

const FilterSectionComponent = ({
  filters,
  actionButtons,
  tableActionButtons,
}: IEnhancedFilterSectionProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Check URL parameters on initial mount to determine if filters are active
  const hasUrlFilters = () => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    const excludedParams = ["pageNumber", "pageSize", "page", "limit"];

    // Convert to array and check if any non-excluded params exist
    const params = Array.from(urlParams.keys());
    return params.some((key) => !excludedParams.includes(key));
  };

  const [showAll, setShowAll] = useState(hasUrlFilters());
  const isInitialMount = useRef(true);

  // Only expand automatically on initial mount if there are filters in URL
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (hasUrlFilters()) {
        setShowAll(true);
      }
    }
  }, []);

  const renderFilterGrid = () => {
    const maxVisibleFilters = isMobile ? 1 : 5;
    const visibleFilters = showAll
      ? filters
      : filters.slice(0, maxVisibleFilters);
    const hasMoreFilters = filters.length > maxVisibleFilters;

    return (
      <Grid container spacing={0.5} style={{ marginTop: 2 }}>
        {/* First Column: Filters and Action Buttons (90% width) */}
        <Grid item xs={12} sm={10.8} md={10.8} lg={10.8}>
          <Grid container spacing={0.5}>
            {visibleFilters.map((filter) => {
              // Map width prop to grid sizes
              const getGridSize = (width?: string) => {
                switch (width) {
                  case "xs":
                    return 1.5;
                  case "sm":
                    return 2;
                  case "md":
                    return 2.5;
                  case "lg":
                    return 3;
                  case "xl":
                    return 4;
                  default:
                    return 1.5;
                }
              };

              return (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={2}
                  lg={getGridSize(filter.width)}
                  key={filter.id}
                >
                  <Box
                    style={{
                      padding: 6,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        marginBottom: 6,
                        fontWeight: 500,
                        color: "#374151",
                        fontSize: 13,
                      }}
                    >
                      {filter.label}
                    </Typography>
                    {filter.component}
                  </Box>
                </Grid>
              );
            })}

            {/* Action buttons at the end of filters */}
            {actionButtons && (
              <Grid item xs={12} sm={4} md={2} lg={1.5}>
                <Box
                  style={{
                    padding: 6,
                    height: "100%",
                  }}
                >
                  {/* Empty label space to align with other filters */}
                  <Typography
                    variant="body2"
                    style={{
                      marginBottom: 4,
                      fontWeight: 500,
                      color: "transparent",
                      fontSize: 13,
                      height: "20px",
                    }}
                  >
                    &nbsp;
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      gap: 6,
                      width: "fit-content",
                    }}
                  >
                    {actionButtons}
                    {hasMoreFilters && (
                      <Box
                        onClick={() => setShowAll(!showAll)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          color: "#374151",
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          minHeight: "32px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {showAll ? (
                          <>
                            <span>{t("sales.quote.showLess")}</span>
                            <span style={{ fontSize: 10 }}>▲</span>
                          </>
                        ) : (
                          <>
                            <span>{t("sales.quote.showMore")}</span>
                            <span
                              style={{
                                fontSize: 10,
                                backgroundColor: "#d1d5db",
                                color: "#6b7280",
                                padding: "1px 4px",
                                borderRadius: 3,
                                fontWeight: 500,
                              }}
                            >
                              +{filters.length - maxVisibleFilters}
                            </span>
                            <span style={{ fontSize: 10 }}>▼</span>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Second Column: Table Action Buttons (10% width) */}
        {tableActionButtons && (
          <Grid item xs={12} sm={1.2} md={1.2} lg={1.2}>
            <Box
              style={{
                padding: 6,
                height: "100%",
                display: "flex",
                alignItems: "end",
                justifyContent: "flex-end",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  gap: 6,
                  width: "fit-content",
                  flexDirection: "row",
                }}
              >
                {tableActionButtons}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  return <Box>{renderFilterGrid()}</Box>;
};

export { FilterSectionComponent };
export type { IFilterItem, IEnhancedFilterSectionProps };
