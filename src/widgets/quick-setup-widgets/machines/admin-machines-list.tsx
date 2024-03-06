import {Checkbox, Collapse, List, ListItem, ListItemIcon, ListItemText, Paper, Stack} from "@mui/material";
import {PrimaryButton} from "@/components/button/primary-button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/quick-setup-widgets/machines/style";

interface IAdminMachinesListProps {
    items: { id: string, name: string, checked: boolean }[];
    onClickOnCheckbox: (id: string) => void;
    categoryName: string;
}

const AdminMachinesList = ({items, onClickOnCheckbox, categoryName}: IAdminMachinesListProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const {classes} = useStyle();
    useEffect(() => {
        setOpen(false)
    }, [categoryName])
    return items?.length > 0 && <>
        <PrimaryButton sx={{fontSize: '14px', padding: 0, height: '20px'}}
                       onClick={() => setOpen(!open)}
                       endIcon={open ? <ExpandLessIcon/> : <ExpandMoreIcon/>}>{t(categoryName)}</PrimaryButton>
        <Collapse in={open}>
            <List dense component={Stack} role="list" gap={'5px'}>
                {items.map(item => {
                    const labelId = item.id;
                    return (
                        <ListItem
                            sx={classes.listItem}
                            key={item.id}
                            role="listitem"
                            button
                            onClick={() => onClickOnCheckbox(item.id)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={item.checked}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={item.name}/>
                        </ListItem>
                    );
                })}
            </List>
        </Collapse>
    </>
}

export {AdminMachinesList}