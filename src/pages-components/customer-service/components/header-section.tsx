import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IissuesHeaderSectionProps, JiraPrintHouse } from "../interface";
import { use, useEffect } from "react";
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
  statusKey,
}: IissuesHeaderSectionProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const statusList = statuses?.map((status: string) => ({ label: status, id: status })) || [];

  return (
    <div style={classes.subHeaderContainer}>
      <div style={classes.filterContainer}>
        <PermissionCheck userPermission={Permissions.SHOW_ADMIN_CUSTOMER_SERVICE}>
          {printHouses?.length > 0 ? (
            <div style={classes.filterSectionContainer}>
              <div style={classes.labelFilterStyle}>{t("customerService.printHouses")}</div>
              <GoMakeAutoComplate
                options={printHouses}
                style={classes.dropDownListStyle}
                placeholder={t("customerService.selectPrintHouse")}
                onChange={onChangePrintHouse}
                value={selectedPrintHouseName}
                getOptionLabel={(option) => option?.name || ""}
                withArrow={true}
                key={statusKey}
              />
            </div>
          ) : (
            <Skeleton variant="rectangular" width={200} height={40} />
          )}
        </PermissionCheck>

        {statusList?.length > 0 ? (
          <div style={classes.filterSectionContainer}>
            <div style={classes.labelFilterStyle}>{t("customerService.status")}</div>
            <GoMakeAutoComplate
              options={statusList}
              style={classes.dropDownListStyle}
              placeholder={t("customerService.selectStatus")}
              onChange={onChangeStatus}
              value={selectedStatus}
              getOptionLabel={(option) => option?.label || ""}
              withArrow={true}
              key={statusKey}
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
