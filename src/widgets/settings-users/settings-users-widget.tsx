import {useTranslation} from "react-i18next";
import {UsersSettings} from "@/widgets/settings-users/users/users-settings";
import {PermissionsWidget} from "@/widgets/settings-users/Permissions/permissions-widget";
import {GoMakeModal} from "@/components";
import {AddEmployee} from "@/widgets/settings-users/users/components/add-employee/add-employee";
import {useEmployee} from "@/widgets/settings-users/users/use-employee";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {AddButton} from "@/components/button/add-button";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {ITab} from "@/components/tabs/interface";
import {EActions} from "@/widgets/settings-users/Permissions/enum/actions";
import {AddUpdateRole} from "@/widgets/settings-users/Permissions/components/add-update-role";
import {useAddRole} from "@/widgets/settings-users/use-add-role";
import { PermissionCheck } from "@/components/CheckPermission";
import { Permissions } from "@/components/CheckPermission/enum";
import { useRecoilState } from "recoil";
import { permissionsState } from "@/store/permissions";
import { useUserPermission } from "@/hooks/use-permission";

const SettingsUsersWidget = () => {
    const {t} = useTranslation();
    const { CheckPermission } = useUserPermission();
    const {
        handleAddEmployeeClick,
        openModal,
        setOpenModal,
        onUpdateEmployee,
        onAddEmployee,
        action,
    } = useEmployee();
    const {addNewRole, setOpenAddRoleModal, openAddRoleModal, inputValue, setInputValue} = useAddRole();
    const tabs: ITab[] = [
        CheckPermission(Permissions.SHOW_USERS) &&  {title:  t("usersSettings.users"), component: <UsersSettings/> },
        CheckPermission(Permissions.SHOW_PERMISSION_MANAGMENT) &&  {title:  t("usersSettings.permission"), component:  <PermissionsWidget/>}
        
    ];
    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} >
                <div style={{display: "flex", gap: 10}}>
                    <PermissionCheck userPermission={Permissions.ADD_EMPLOYEE} >
                           <AddButton label={t("usersSettings.addEmployee")} onClick={handleAddEmployeeClick}/>
                    </PermissionCheck>
                    <PermissionCheck userPermission={Permissions.ADD_ROLE} >
                        <AddButton label={t("permissionsSettings.addRole")}
                               onClick={() => setOpenAddRoleModal(true)}/>
                    </PermissionCheck>
                  
                </div>


            </PrimaryTabsComponent>

            <GoMakeModal
                insideStyle={{paddingLeft: 0, paddingRight: 0}}
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
            <GoMakeModal   insideStyle={{ paddingLeft: 0, paddingRight: 0, width: 500, height: 250 }}
                           headerPadding={20}
                           openModal={openAddRoleModal}
                           onClose={() => setOpenAddRoleModal(false)}
                           modalTitle={t("permissionsSettings.addRole")}>
                <AddUpdateRole onActionClick={addNewRole} action={EActions.ADD}   value={inputValue} onChange={(v)=>{setInputValue(v)}}/>
            </GoMakeModal>
        </div>
    );
};

export {SettingsUsersWidget};
