import React, { CSSProperties } from "react";
import { CardContainer } from "../job-card-container";
import { useStyle } from "./style";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

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

  return (
    <CardContainer label={header} withHeader={withHeader} style={style}>
      <Stack gap={"8px"}>
        {/* Main Section Title */}
        <span style={classes.title}>{name}</span>

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
                        width: "20%",
                        borderBottom: "none",
                        padding: "16px 0px",
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
                        padding: "16px 0px",
                        borderBottom: isLastRow ? "none" : "1px solid #E5E5E5",
                      }}
                    >
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        sx={{ rowGap: "10px", columnGap: "120px" }} // Applying gap without margin
                      >
                        {subSection.productionFloorProperties.map(
                          (property, propIndex) => (
                            <span key={propIndex} style={classes.propertyValue}>
                              <span style={classes.propertyName}>
                                {property.name}:
                              </span>{" "}
                              {property.value}{" "}
                              {property.unit && `(${property.unit})`}
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
