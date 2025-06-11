import { useTranslation } from "react-i18next";
import { UsersSettings } from "@/widgets/settings-users/users/users-settings";
import { PermissionsWidget } from "@/widgets/settings-users/Permissions/permissions-widget";
import { GoMakeModal } from "@/components";
import { AddEmployee } from "@/widgets/settings-users/users/components/add-employee/add-employee";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { EmployeeActions } from "@/widgets/settings-users/users/enums/employee-actions";
import { AddButton } from "@/components/button/add-button";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { EActions } from "@/widgets/settings-users/Permissions/enum/actions";
import { AddUpdateRole } from "@/widgets/settings-users/Permissions/components/add-update-role";
import { useAddRole } from "@/widgets/settings-users/use-add-role";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { GoMakeDialog } from "@/components/dialog/dialog";
import { RolesWidget } from "./Roles/roles-widget";
import Head from "next/head";

const SettingsUsersWidget = () => {
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const {
    handleAddEmployeeClick,
    openModal,
    setOpenModal,
    onUpdateEmployee,
    onAddEmployee,
    action,
    openVerificationModal,
    handleCloseVerificationModal,
  } = useEmployee();

  const {
    addNewRole,
    setOpenAddRoleModal,
    openAddRoleModal,
    inputValue,
    setInputValue,
    value,
    setValue,
  } = useAddRole();

  const tabs: ITab[] = [
    CheckPermission(Permissions.SHOW_EMPLOYEES) && {
      title: t("usersSettings.users"),
      component: <UsersSettings />,
    },
    CheckPermission(Permissions.SHOW_PERMISSIONS) && {
      title: t("usersSettings.permission"),
      component: <PermissionsWidget />,
    },
    {
      title: t("usersSettings.roles"),
      component: <RolesWidget />,
    },
  ].filter(Boolean);

  const renderAddButton = (activeTabTitle: string) => {
    if (activeTabTitle === t("usersSettings.users")) {
      return (
        <PermissionCheck userPermission={Permissions.ADD_EMPLOYEE}>
          <AddButton
            label={t("usersSettings.addEmployee")}
            onClick={handleAddEmployeeClick}
          />
        </PermissionCheck>
      );
    } else if (activeTabTitle === t("usersSettings.roles")) {
      return (
        <PermissionCheck userPermission={Permissions.ADD_ROLE}>
          <AddButton
            label={t("permissionsSettings.addRole")}
            onClick={() => setOpenAddRoleModal(true)}
          />
        </PermissionCheck>
      );
    }
    return null;
  };

  return (
    <div data-tour={"settingUsersWidget"}>
      <Head>
        <title>{t("usersSettings.users")}</title>
      </Head>
      <PrimaryTabsComponent
        tabs={tabs}
        selectedTabIndex={value}
        onSelectTab={(newIndex) => {
          setValue(newIndex);
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {renderAddButton(tabs[value]?.title || "")}
        </div>
      </PrimaryTabsComponent>
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
      <GoMakeDialog
        open={openVerificationModal}
        onClose={handleCloseVerificationModal}
        title={t("usersSettings.mailVerificationRequired")}
        description={t("usersSettings.verificationMailSent")}
      />
      <GoMakeModal
        insideStyle={{
          paddingLeft: 0,
          paddingRight: 0,
          width: 500,
          height: 250,
        }}
        headerPadding={20}
        openModal={openAddRoleModal}
        onClose={() => setOpenAddRoleModal(false)}
        modalTitle={t("permissionsSettings.addRole")}
      >
        <AddUpdateRole
          onActionClick={addNewRole}
          action={EActions.ADD}
          value={inputValue}
          onChange={(v) => {
            setInputValue(v);
          }}
        />
      </GoMakeModal>
    </div>
  );
};

export { SettingsUsersWidget };
