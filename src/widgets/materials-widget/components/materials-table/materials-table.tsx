import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { useEffect, useState } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useTranslation } from "react-i18next";
import { useMaterialsTypes } from "@/widgets/materials-widget/components/materials-table/use-materials-types";
import { Filter2Icon } from "@/icons/filter2-icon";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { MoreMenuWidget } from "./more-menu";
interface IMaterialsTableComponentProps {
  isAdmin: boolean;
}
enum EFilterStatus {
  All,
  Active,
  Inactive,
};
const MaterialsTableComponent = (props: IMaterialsTableComponentProps) => {

  const { getAllMaterials, getTableRows, onFilterChange, handleCloseMoreMenu, anchorElMenuTable, selectedMaterial } = useMaterialsTypes(props.isAdmin);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const tableHeaders = [t("materials.materialsType"), t("materials.edit"), t("properties.more")];
  const [filterStatus, setFilterStatus] = useState<{
    label: string;
    value: EFilterStatus;
  }>({
    label: "All",
    value: EFilterStatus.All,
  });

  const filterStatusList = [
    {
      label: "All",
      value: EFilterStatus.All,
    },
    {
      label: "Active",
      value: EFilterStatus.Active,
    },
    {
      label: "Inactive",
      value: EFilterStatus.Inactive,
    },
  ];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    getAllMaterials().then();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headerContainer}>

        <HeaderTitleWithSearch title={props.isAdmin ? t("tabs.materialsAdmin") : t("tabs.materials")} onChange={onFilterChange}
          children={
            <div style={classes.filterByStatus} onClick={handleClick}>
              <Filter2Icon /> Filter by status: {filterStatus.label}
            </div>
          }
        />

      </div>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={getTableRows()}
        headers={tableHeaders}
        dataTour={'materialsTable'}
      />
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl} style={classes.filterMenuContainer} >
        {filterStatusList.map((item) => (
          <MenuItem className="action-menu-item" style={classes.filterMenuItem} key={item.value} onClick={() => {
            setFilterStatus(item)
            handleClose()
          }}>
            {item.label}
          </MenuItem>
        ))}
      </GoMakeMenu>
      <MoreMenuWidget
        handleClose={handleCloseMoreMenu}
        open={!!anchorElMenuTable}
        anchorEl={anchorElMenuTable}
        selectedMaterial={selectedMaterial}
      />
    </div>
  );
};
export { MaterialsTableComponent };
