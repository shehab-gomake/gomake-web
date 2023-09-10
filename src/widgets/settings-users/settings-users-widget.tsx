import {
  CustomTabPanel,
  UsersSettingsTab,
  UsersSettingsTabs,
} from "@/widgets/settings-users/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UsersSettings } from "@/widgets/settings-users/users/users-settings";
import { PermissionsWidget } from "@/widgets/settings-users/Permissions/permissions-widget";
import { useStyle } from "@/widgets/settings-users/style";
import Button from "@mui/material/Button";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { GoMakeModal } from "@/components";
import { AddEmployee } from "@/widgets/settings-users/users/components/add-employee/add-employee";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { EmployeeActions } from "@/widgets/settings-users/users/enums/employee-actions";

const SettingsUsersWidget = () => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {
    handleAddEmployeeClick,
    openModal,
    setOpenModal,
    onUpdateEmployee,
    onAddEmployee,
    action,
  } = useEmployee();
  return (
    <div>
      <div style={classes.tabsContainer}>
        <UsersSettingsTabs
          value={value}
          onChange={handleChange}
          aria-label="tabs example"
        >
          <UsersSettingsTab label={t("usersSettings.users")} />
          <UsersSettingsTab label={t("usersSettings.permission")} />
        </UsersSettingsTabs>
        <Button
          sx={classes.addBtn}
          startIcon={<AddBoxOutlinedIcon />}
          variant={"contained"}
          onClick={handleAddEmployeeClick}
        >
          {t("usersSettings.addEmployee")}
        </Button>
      </div>
      <CustomTabPanel value={value} index={0}>
        <UsersSettings />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PermissionsWidget />
      </CustomTabPanel>

      <GoMakeModal
        insideStyle={{ paddingLeft: 0, paddingRight: 0 }}
        headerPadding={20}
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        modalTitle={t(
          action === EmployeeActions.ADD
            ? "usersSettings.addEmployee"
            : "usersSettings.editEmployee"
        )}
      >
        <AddEmployee
          onClickUpdate={onUpdateEmployee}
          action={action}
          onClickAdd={onAddEmployee}
        />
      </GoMakeModal>
    </div>
  );
};

export { SettingsUsersWidget };
