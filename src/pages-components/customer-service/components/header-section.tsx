import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { GoMakeAutoComplate } from "@/components";
import { Skeleton, Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IissuesHeaderSectionProps } from "../interface";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";

const IssuesHeaderSection = ({
  handleClean,
  printHouses,
  onChangePrintHouse,
  selectedPrintHouseName,
  statuses,
  onChangeStatus,
  selectedStatus,
}: IissuesHeaderSectionProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.subHeaderContainer}>
      <div style={classes.filterContainer}>
        <PermissionCheck
          userPermission={Permissions.SHOW_ADMIN_CUSTOMER_SERVICE}
        >
          {printHouses?.length > 0 ? (
            <div style={classes.filterSectionContainer}>
              <div style={classes.labelFilterStyle}>
                {t("customerService.printHouses")}
              </div>
              <GoMakeAutoComplate
                key={`print-house-select-${selectedPrintHouseName || "null"}`}
                value={selectedPrintHouseName || null}
                options={printHouses}
                style={classes.dropDownListStyle}
                placeholder={t("customerService.selectPrintHouse")}
                onChange={onChangePrintHouse}
                withArrow={true}
              />
            </div>
          ) : (
            <Skeleton variant="rectangular" width={200} height={40} />
          )}
        </PermissionCheck>

        {statuses?.length > 0 ? (
          <div style={classes.filterSectionContainer}>
            <div style={classes.labelFilterStyle}>
              {t("customerService.status")}
            </div>
            <GoMakeAutoComplate
              key={`status-select-${selectedStatus || "null"}`}
              options={statuses}
              style={classes.dropDownListStyle}
              placeholder={t("customerService.selectStatus")}
              onChange={onChangeStatus}
              value={selectedStatus}
              withArrow={true}
            />
          </div>
        ) : (
          <Skeleton variant="rectangular" width={200} height={40} />
        )}
        <SecondaryButton style={classes.cleanBtnStyle} onClick={handleClean}>
          {t("customers.buttons.clean")}
        </SecondaryButton>
      </div>
    </div>
  );
};

export { IssuesHeaderSection };
