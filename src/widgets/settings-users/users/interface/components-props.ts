import {IUser} from "@/widgets/settings-users/users/interface/user";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";

export interface ITableFilterProps {
    onChangeShowInActive: (value: boolean)=>void;
    onChangeFilter: (value: string) => void;
}

export interface IUsersTableProps {
    users: IUser[];
    onEditEmployee: (id: string) => void;
    onToggleEmployeeStatus: (id: string) => void;
}

export interface IAddEmployeeProps {
    onClickAdd: () => void;
    onClickUpdate: () => void;
    action: EmployeeActions
}
export interface ISettingsUsersProps {

}