import { CSSProperties } from "react";
import { CardContainer } from "../job-card-container";
import { useStyle } from "./style";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Property {
  name: string;
  value: string;
  unit: string | null;
}

interface SubSection {
  name: string;
  productionFloorProperties: Property[];
}

interface SectionProps {
  withHeader?: boolean;
  header?: string;
  name: string;
  productionFloorSubSections: SubSection[];
  style?: CSSProperties;
}

const ProductDetailsSection: React.FC<SectionProps> = ({
  withHeader,
  header,
  name,
  productionFloorSubSections,
  style,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  return (
    <CardContainer label={header} withHeader={withHeader} style={style}>
      <Stack gap={"8px"} sx={{ direction: isRTL ? "rtl" : "ltr" }}>
        {/* Main Section Title */}
        <span
          style={{
            ...classes.title,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {name}
        </span>

        <TableContainer>
          <Table>
            <TableBody>
              {productionFloorSubSections.map((subSection, subIndex) => {
                const isLastRow =
                  subIndex === productionFloorSubSections.length - 1;
                return (
                  <TableRow key={subIndex} sx={{ borderBottom: "none" }}>
                    {/* SubSection Name*/}
                    <TableCell
                      style={{
                        minWidth: "fit-content",
                        width: "15%",
                        borderBottom: "none",
                        padding: "10px 0px",
                        textAlign: isRTL ? "right" : "left",
                        alignContent: "start",
                        ...classes.subTitles,
                      }}
                    >
                      {subSection.name}
                    </TableCell>
                    {/* Property Values */}
                    <TableCell
                      colSpan={4}
                      sx={{
                        padding: "10px 0px",
                        borderBottom: isLastRow ? "none" : "1px solid #E5E5E5",
                      }}
                    >
                      <Stack
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(2, minmax(0, 1fr))", // 2 columns on small screens
                            sm: "repeat(4, minmax(0, 1fr))", // 4 columns on larger screens
                          },
                          rowGap: "10px",
                          direction: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {subSection.productionFloorProperties.map(
                          (property, propIndex) => (
                            <span
                              key={propIndex}
                              style={{
                                ...classes.propertyValue,
                                textAlign: isRTL ? "right" : "left",
                                padding: "0px 8px",
                              }}
                            >
                              <span
                                style={{
                                  ...classes.propertyName,
                                  direction: isRTL ? "rtl" : "ltr",
                                }}
                              >
                                {property.name}:
                              </span>{" "}
                              {property.value}{" "}
                              {property.unit && `${property.unit}`}
                            </span>
                          )
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </CardContainer>
  );
};

export default ProductDetailsSection;
