import { IconButton } from "@mui/material";
import HideSourceIcon from '@mui/icons-material/HideSource';
import { useCallback, useEffect } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';


const DeactivateEmployee = ({ item }: any) => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const { setSnackbarStateValue } = useSnackBar();

    const onClickDeactivateEmployee = useCallback(async () => {
        const res = await callApi(
            "PUT",
            `/v1/employee/delete-employee`,
            {
                id: item?.id,
            }
        );
        if (res?.success) {
            setSnackbarStateValue({
                state: true,
                message: t("employees.successfullyUpdated"),
                type: "sucess",
            });
        } else {
            setSnackbarStateValue({
                state: true,
                message: t("employees.updatedfailed"),
                type: "error",
            });
        }
    }, [item]);

    

    return (
        <>
            <IconButton>
                {item.isActive ? (
                    <ToggleOnIcon onClick={() => onClickDeactivateEmployee()}/>
                ) : (
                    <ToggleOffIcon onClick={() => onClickDeactivateEmployee()}/>
                )}
            </IconButton>
        </>
    );
};
export { DeactivateEmployee };
