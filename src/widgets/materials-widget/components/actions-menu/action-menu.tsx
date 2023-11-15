import {IconButton, Menu, MenuItem} from "@mui/material";
import {SettingsIcon} from "@/icons/settings";
import React, {useState} from "react";
import {useStyle} from "@/components/options-button/style";
import {useTranslation} from "react-i18next";
import {EMaterialsActions} from "@/widgets/materials-widget/enums";
import {useMaterialsActions} from "@/widgets/materials-widget/components/actions-menu/use-materials-actions";
import {GoMakeAutoComplate, GoMakeModal, GomakeTextInput} from "@/components";
import Stack from "@mui/material/Stack";
import {SecondaryButton} from "@/components/button/secondary-button";
import {useRecoilValue} from "recoil";
import {currenciesState, materialActionState} from "@/widgets/materials-widget/state";

const ActionMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {t} = useTranslation();
    const {onChooseAction, action, updatedValue, onTextInputChange, onUpdate} = useMaterialsActions();
    const currencies = useRecoilValue(currenciesState);
    const materialActions = useRecoilValue(materialActionState);

    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={handleMoreOptionIconClick}>
                <SettingsIcon stroke={"#000000"}/>
            </IconButton>
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                transformOrigin={{horizontal: "right", vertical: "top"}}
                anchorOrigin={{horizontal: "center", vertical: "bottom"}}
                onClick={handleCloseMenu}
            >
                {
                    materialActions?.map(action => <MenuItem key={action.action} onClick={() => onChooseAction(action)}>
                        {t('materialsActions.' + action.key)}
                    </MenuItem>)
                }
            </Menu>
            <GoMakeModal insideStyle={{width: 'fit-content', height: 'fit-content'}} openModal={action !== null} modalTitle={t('materialsActions.' + action?.key)} onClose={() => onChooseAction(null)}>
                <Stack gap={3} alignItems={'center'} justifyContent={'center'} minWidth={'350px'}>
                    { action?.action === EMaterialsActions.UpdateCurrency ? <GoMakeAutoComplate style={{width: '100%'}} value={updatedValue} options={currencies} onChange={(e, value) => onTextInputChange(value.value)}/>:
                        <GomakeTextInput onChange={(e) => onTextInputChange(e.target.value)} value={updatedValue}/>
                    }
                    <SecondaryButton onClick={onUpdate} sx={{width: '100%'}} variant={'contained'}>update</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </>
    );
}

export {ActionMenu}