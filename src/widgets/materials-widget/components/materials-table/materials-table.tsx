import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useMaterialsTypes } from "@/widgets/materials-widget/components/materials-table/use-materials-types";
import { Filter2Icon } from "@/icons/filter2-icon";
import { GoMakeMenu, GomakePrimaryButton } from "@/components";
import { MenuItem } from "@mui/material";

interface IMaterialsTableComponentProps {
  isAdmin: boolean;
}
export enum EFilterStatus {
  All,
  Active,
  Inactive,
}

const MaterialsTableComponent = (props: IMaterialsTableComponentProps) => {
  const {
    t,
    getTableRows,
    onFilterChange,
    setFilterStatus,
    handleClick,
    handleClose,
    filterStatus,
    filterStatusList,
    tableHeaders,
    anchorEl,
    open,
  } = useMaterialsTypes(props.isAdmin);

  const { classes } = useStyle();

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerContainer}>
        <HeaderTitleWithSearch
          title={props.isAdmin ? t("tabs.materialsAdmin") : t("tabs.materials")}
          onChange={onFilterChange}
          children={
            <div style={classes.childrenMaterialHedar}>
              <GomakePrimaryButton
                style={classes.manageProfitsButton}
                onClick={() => {
                  const uri = `/products/profits?actionId=5f3e9084-6724-4358-9f94-8c63019c8894&actionName=Raw materials`;
                  window.open(uri, "_blank");
                }}
              >
                {t("navigationButtons.manageProfits")}
              </GomakePrimaryButton>
              <div style={classes.filterByStatus} onClick={handleClick}>
                <Filter2Icon /> {t("navigationButtons.filterByStatus")}:{" "}
                {filterStatus?.label}
              </div>
            </div>
          }
        />
      </div>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={getTableRows()}
        headers={tableHeaders}
        dataTour={"materialsTable"}
      />
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={classes.filterMenuContainer}
      >
        {filterStatusList.map((item) => (
          <MenuItem
            className="action-menu-item"
            style={classes.filterMenuItem}
            key={item.value}
            onClick={() => {
              setFilterStatus(item);
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </GoMakeMenu>
    </div>
  );
};
export { MaterialsTableComponent };
