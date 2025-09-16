import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const [showAll, setShowAll] = useState(false);

  const renderFilterGrid = () => {
    const visibleFilters = showAll ? filters : filters.slice(0, 5);
    const hasMoreFilters = filters.length > 5;

    return (
      <Grid container spacing={0.5} style={{ marginTop: 2 }}>
        {/* First Column: Filters and Action Buttons (90% width) */}
        <Grid item xs={12} sm={10.8} md={10.8} lg={10.8}>
          <Grid container spacing={0.5}>
            {visibleFilters.map((filter) => (
              <Grid item xs={12} sm={4} md={2} lg={1.5} key={filter.id}>
                <Box
                  style={{
                    padding: 6,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      marginBottom: 4,
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
            ))}

            {/* Action buttons at the end of filters */}
            {actionButtons && (
              <Grid item xs={12} sm={4} md={2} lg={1.5}>
                <Box
                  style={{
                    padding: 6,
                    height: "100%",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
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
                              +{filters.length - 5}
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
