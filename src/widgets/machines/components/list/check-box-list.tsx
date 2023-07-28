import {Checkbox, List, ListItem, ListItemIcon, ListItemText, Paper} from "@mui/material";

const CheckBoxList = (items: { id: string, name: string, checked: boolean }[], onClickOnCheckbox: (id: string) => void) => (
    <Paper sx={{width: 200, height: 300, overflow: 'auto', marginTop: 2}}>
<List dense component="div" role="list">
    {items.map( item => {
            const labelId = item.id;

            return (
                <ListItem
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
    </Paper>
);

export {CheckBoxList}