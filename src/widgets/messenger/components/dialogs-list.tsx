import 'react-chat-elements/dist/main.css';
import Stack from "@mui/material/Stack";
import {
    Avatar,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import {formatDistanceToNow} from "date-fns";
import {FONT_FAMILY} from "@/utils/font-family";
import {PlusIcon} from "@/icons";
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {useState} from "react";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {useTranslation} from "react-i18next";

export interface IProps {
    onSelectDialog: (dialogId: IChatDialog) => void
    dialogs: IChatDialog[];
    selectedDialogId?: string;
    unRead?: number;
    onClickAddDialog: ()=>void;
}

const DialogList = ({onSelectDialog, dialogs, selectedDialogId, unRead, onClickAddDialog}: IProps) => {
    const [filter, setFilter] = useState<string>('');
    const {t} = useTranslation();
    return (
        <Stack style={{backgroundColor: '#FFF'}} padding={'12px'} gap={'12px'}>
            <Stack padding={'12px'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack  direction={'row'} alignItems={'center'} gap={'10px'}>
                    <h3>{t('messenger.dialogsTitle')}</h3>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#EDF2F7',
                    }}>{unRead}</div>
                </Stack>
                <IconButton onClick={onClickAddDialog} style={{backgroundColor: '#2E3092', height: 30, width: 30,}}>
                    <PlusIcon stroke={'#FFF'}/>
                </IconButton>
            </Stack>
            <Divider/>
            <List sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backgroundColor: '#FFF',
                cursor: 'pointer',
                padding: 0
            }}>
                <SearchInputComponent bgColor={'#F3F3F3'} onChange={()=>{}}/>
                {
                    dialogs.map(dialog =>
                        <ListItem alignItems="flex-start"
                                  onClick={() => onSelectDialog(dialog)}
                                  secondaryAction={<span style={{
                                      ...FONT_FAMILY.Inter(500, 14),
                                      opacity: 0.3,
                                      marginTop: 'auto'
                                  }}>{formatDistanceToNow(new Date(dialog.last_message_date_sent * 1000), {addSuffix: true})}</span>}
                                  sx={{
                                      borderRadius: '12px',
                                      backgroundColor: dialog._id === selectedDialogId ? '#615EF00F' : '#FFF'
                                  }}>
                            <ListItemAvatar>
                                <Avatar variant={'rounded'} src={dialog?.photo}/>
                            </ListItemAvatar>
                            <ListItemText primary={dialog.name}/>
                        </ListItem>
                    )
                }
            </List>
        </Stack>
    );
};

export {DialogList};