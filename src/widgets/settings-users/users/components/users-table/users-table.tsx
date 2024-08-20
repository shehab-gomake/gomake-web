import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/settings-users/users/components/users-table/style";
import { OptionsButton } from "@/components/options-button/options-button";
import { Divider, MenuItem } from "@mui/material";
import { ConvertIcon } from "@/components/icons/convert-icon";
import { EditIcon } from "@/components/icons/edit-icon";
import { IUsersTableProps } from "@/widgets/settings-users/users/interface/components-props";
import styled from "styled-components";

const formatDate = (date): string => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1; // Month is zero-indexed
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

const ScrollableTableContainer = styled.div`
    max-height: 60vh;
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: auto; /* Enable horizontal scrolling */
    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #CCCDCF;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #b0b0b0;
    }

    &::-webkit-scrollbar-button {
        display: none;
    }
`;

const UsersTable = ({ users, onEditEmployee, onToggleEmployeeStatus }: IUsersTableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const tableHeaders = [
        t('usersSettings.roleID'),
        t('usersSettings.employee'),
        t('usersSettings.email'),
        t('usersSettings.phone'),
        t('usersSettings.date'),
        t('usersSettings.status'),
        t('usersSettings.more')
    ];

    return (
        <ScrollableTableContainer>
            <table style={{ width: '100%', textAlign: "center" }}>
                <thead>
                    <tr>
                        {
                            tableHeaders.map((header, index) => <th key={index} style={classes.tableHeader}>{header}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        users?.map(user => (
                            <tr key={user.id}>
                                <td style={classes.tableBody}>{user.role}</td>
                                <td style={classes.tableBody}>{user.firstname + ' ' + user.lastname}</td>
                                <td style={classes.tableBody}>{user.email}</td>
                                <td style={classes.tableBody}>{user.phone}</td>
                                <td style={classes.tableBody}>{formatDate(user.creationDate)}</td>
                                <td style={classes.tableBody}>
                                    <span style={user.isActive ? classes.active : classes.inActive}>
                                        {user.isActive ? t('usersSettings.active') : t('usersSettings.inactive')}
                                    </span>
                                </td>
                                <td style={classes.tableBody}>
                                    <OptionsButton>
                                        <MenuItem onClick={() => onEditEmployee(user.id)}>
                                            <div style={classes.menuBtn}>
                                                <EditIcon {...classes.icon} />
                                                <span>{t('usersSettings.editing')}</span>
                                            </div>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => onToggleEmployeeStatus(user.id)}>
                                            <div style={classes.menuBtn}>
                                                <ConvertIcon {...classes.icon} />
                                                <span>
                                                    {user.isActive ? t('usersSettings.InActiveUser') : t('usersSettings.activeUser')}
                                                </span>
                                            </div>
                                        </MenuItem>
                                    </OptionsButton>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </ScrollableTableContainer>
    );
}

export { UsersTable }
