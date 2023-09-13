import { useTranslation } from "react-i18next";
import { UsersSettings } from "@/widgets/settings-users/users/users-settings";
import { PermissionsWidget } from "@/widgets/settings-users/Permissions/permissions-widget";
import { GoMakeModal } from "@/components";
import { AddEmployee } from "@/widgets/settings-users/users/components/add-employee/add-employee";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { EmployeeActions } from "@/widgets/settings-users/users/enums/employee-actions";
import {AddButton} from "@/components/button/add-button";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {ITab} from "@/components/tabs/interface";
import { useState } from "react";
import { AddRoleModal } from "./Permissions/modals";

const SettingsUsersWidget = () => {
  const { t } = useTranslation();
  const {
    handleAddEmployeeClick,
    openModal,
    setOpenModal,
    onUpdateEmployee,
    onAddEmployee,
    action,
  } = useEmployee();
  const [isNewRole, setisNewRole] = useState(false);
  const onClickCloseNewRole = () => {
      setisNewRole(false);
  };

  const tabs: ITab[] = [
      {title: t("usersSettings.users"), component: <UsersSettings/>},
      {title: t("usersSettings.permission"), component: <PermissionsWidget/>}
  ];
  return (
    <div>
        <PrimaryTabsComponent tabs={tabs}>
         
            <AddButton label={t("usersSettings.addEmployee")} onClick={handleAddEmployeeClick}/>
            <AddButton label={t("permissionsSettings.AddRole")} onClick={() => setisNewRole(true)}/>
         
     
        </PrimaryTabsComponent>
        <AddRoleModal
                openModal={isNewRole}
                modalTitle={t("permissionsSettings.AddNewRole")}
                onClose={onClickCloseNewRole}

            />
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
