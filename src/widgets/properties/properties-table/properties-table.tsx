import { styled } from "@mui/material/styles";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useStyle } from "@/widgets/properties/properties-table/style";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreMenuWidget } from "../more-circle";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";

import { useProperites } from "../hooks/use-properites";
import { MoreCircleIcon } from "@/icons";
import { AddRuleModal } from "@/pages-components/products/profits-new/widgets/add-rule-modal";
import { EditRulesModal } from "../properties-modals/edit-rule-modal";
import { useRouter } from "next/router";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBECFF",
    color: "#000000",
    ...FONT_FAMILY.Lexend(500, 14),
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    ...FONT_FAMILY.Lexend(500, 14),
    color: "#656572",
    padding: 5,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#ECECEC",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PropertiesTable = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    openAddRule,
    openEditRule,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    onCOpenEditModal,
    onCloseEditModal,
    anchorEl,
    open,
    handleClick,
    handleClose,
    selectedProperties,
    setSelectedProperites,
    properties,
    setFilter,
    getProperitesService,
    deleteRule,
    reOrderPricingTables,
  } = useProperites();
  const router = useRouter();
  return (
    <>
      <div style={classes.headerContainer}>
        <HeaderTitleWithSearch
          title={
            router.query.actionName + " " + t("products.actions.properties")
          }
          onChange={(e) => setFilter(e)}
        />
      </div>

      <TableContainer style={classes.shadowBorder}>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#EBECFF" }}>
              <StyledTableCell align={"center"}>
                {t("properties.parameter")}
              </StyledTableCell>
              <StyledTableCell align={"center"}>
                {t("properties.unit")}
              </StyledTableCell>
              <StyledTableCell style={{ width: "30%" }} align={"center"}>
                {t("properties.rule")}
              </StyledTableCell>
              <StyledTableCell align={"center"}>
                {t("properties.type")}
              </StyledTableCell>
              <StyledTableCell align={"center"}>
                {t("properties.more")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties()?.map((property, index) => {
              return (
                <StyledTableRow>
                  <StyledTableCell align={"center"}>
                    {property.propertyName}{" "}
                  </StyledTableCell>
                  <StyledTableCell align={"center"}>
                    {property.defaultUnit}
                  </StyledTableCell>
                  <StyledTableCell align={"center"}>
                    <div style={classes.rowItem} className="scrollBlue">
                      {property.actionRules
                        ?.sort((a, b) => a.priority - b.priority)
                        ?.map((rule, index) => {
                          return (
                            <div style={classes.item}>
                              {rule.successEvent ? (
                                <>
                                  {index + 1}- {rule.expression} value=
                                  {rule.successEvent}
                                </>
                              ) : (
                                <>
                                  {index + 1}- {rule.expression}
                                </>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align={"center"}>
                    {property.ruleType == 0 ? "Output" : "Input"}{" "}
                  </StyledTableCell>
                  <StyledTableCell align={"center"}>
                    <IconButton
                      onClick={(e) => {
                        handleClick(e);
                        setSelectedProperites(property);
                      }}
                    >
                      <MoreCircleIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <AddRuleModal
        openModal={openAddRule}
        onCloseModal={onCloseAddRuleModal}
        isPropertiesWidge={true}
        selectedProperties={selectedProperties}
        getProperitesService={getProperitesService}
      />
      <EditRulesModal
        openModal={openEditRule}
        onClose={onCloseEditModal}
        selectedProperties={selectedProperties}
        onOpenAddRuleModal={onOpenAddRuleModal}
        deleteRule={deleteRule}
        reOrderPricingTables={reOrderPricingTables}
      />
      <MoreMenuWidget
        onOpenAddRuleModal={onOpenAddRuleModal}
        onCOpenEditModal={onCOpenEditModal}
        handleClose={handleClose}
        anchorEl={anchorEl}
        open={open}
      />
    </>
  );
};

export { PropertiesTable };
