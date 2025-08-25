import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeMenu } from "@/components/menu/menu";
import { useAdminMachinesCategories } from "./use-admin-machines";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { StepType } from "@reactour/tour";
import { Filter2Icon } from "@/icons/filter2-icon";
import { MenuItem } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

const AdminCategoriesTable = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {
        tableHeaders,
        tableRows,
        filterStatus,
        filterStatusList,
        open,
        anchorEl,
        handleClick,
        handleClose,
        setFilterStatus,
        onFilterChange,
    } = useAdminMachinesCategories();

    const machinesTableSteps: StepType[] = [
        {
            selector: '[data-tour="machinesTable"]',
            content: 'This is the table displaying all the machines we support.\n',
            position: 'right',

        },
        {
            selector: '[data-tour="editDigitalPrinting"]',
            content: 'Please click on "Edit" in the "Digital Printers line to explore the functionalities available for managing machines data.',
            position: 'top',
        },
    ]
    const { } = useGoMakeTour(machinesTableSteps, []);
    
    return (
        <div style={classes.mainContainer}>
            <HeaderTitleWithSearch
                title={t("tabs.materialsAdmin")}
                onChange={onFilterChange}
                children={
                    <div style={classes.childrenMaterialHedar}>
                        <div style={classes.filterByStatus} onClick={handleClick}>
                            <Filter2Icon /> {t("navigationButtons.filterByStatus")}:{" "}
                            {filterStatus?.label}
                        </div>
                    </div>
                }
            />
            <SecondaryButton
                style={classes.addMachineBtn}
                variant={"contained"}
                href={`/machines-admin/add-machine`}
                startIcon={<AddIcon />}
            >{t("tabs.addMachine")}</SecondaryButton>
            <div style={{ width: '100%' }} data-tour={'machinesTable'}>
                <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={tableRows} headers={tableHeaders} />
            </div>

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

export { AdminCategoriesTable };
