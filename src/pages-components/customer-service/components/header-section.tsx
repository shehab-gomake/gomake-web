import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { IIssuesHeaderSectionProps } from "../interface";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";

const IssuesHeaderSection = ({
  isAdmin,
  handleClean,
  printHouses,
  onChangePrintHouse,
  selectedPrintHouse,
  statuses,
  setPatternSearch,
  patternSearch,
  statusFilters,
  onToggleAllStatuses,
  onToggleStatus,
  onChangeStatus,
}: IIssuesHeaderSectionProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.subHeaderContainer}>
      <div style={classes.filterContainer}>
        {isAdmin && (
          <PermissionCheck
            userPermission={Permissions.SHOW_ADMIN_CUSTOMER_SERVICE}
          >
            {printHouses?.length > 0 ? (
              <div style={classes.filterSectionContainer}>
                <div style={classes.labelFilterStyle}>
                  {t("customerService.printHouses")}
                </div>
                <GoMakeAutoComplate
                  key={`print-house-select-${
                    selectedPrintHouse?.value || "null"
                  }`}
                  value={selectedPrintHouse || null}
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
        )}

        {statuses?.length > 0 ? (
          <div style={classes.filterSectionContainer}>
            <div style={classes.labelFilterStyle}>
              {t("customerService.status")}
            </div>
            {/* <MultiSelectDropdown
              items={statuses.map((s) => ({ id: s.value, label: s.label }))}
              selectedIds={statusFilters}
              onToggle={onToggleStatus}
              onToggleAll={onToggleAllStatuses}
              buttonLabel={t("customerService.status")}
              withSearch={false}
            /> */}
            <GoMakeMultiSelect
              onChange={onChangeStatus}
              options={statuses}
              values={statusFilters}
              placeholder={t("customerService.selectStatus")}
            />
          </div>
        ) : (
          <Skeleton variant="rectangular" width={200} height={40} />
        )}
        <SecondaryButton style={classes.cleanBtnStyle} onClick={handleClean}>
          {t("customers.buttons.clean")}
        </SecondaryButton>
      </div>
      <SearchInputComponent
        onChange={(e) => {
          setPatternSearch(e);
        }}
        value={patternSearch}
      />
    </div>
  );
};

export { IssuesHeaderSection };
