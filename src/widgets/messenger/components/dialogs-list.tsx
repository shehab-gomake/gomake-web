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
import {SearchInputComponent} from "@/components/form-inputs/search-input-component";
import {useCallback, useEffect, useRef, useState} from "react";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

export interface IProps {
    onSelectDialog: (dialogId: IChatDialog) => void
    dialogs: IChatDialog[];
    selectedDialogId?: string;
    unRead?: number;
    onClickAddDialog: () => void;
}

const DialogList = ({onSelectDialog, dialogs, selectedDialogId, onClickAddDialog}: IProps) => {
    const [filter, setFilter] = useState<string>('');
    const {t} = useTranslation();
    const {primaryColor} = useGomakeTheme();
    const ref = useRef(null);
    const getDialogs = useCallback(() => {
        return filter ? dialogs.filter(d => d.name?.includes(filter)) : dialogs
    }, [dialogs, filter]);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
    }, [selectedDialogId])
    return (
        <Stack style={{backgroundColor: '#FAFAFA'}} padding={'12px'} gap={'12px'} overflow={'hidden'}>
            <Stack padding={'12px'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                    <h3 style={{color: primaryColor(600), ...FONT_FAMILY.Lexend(600, 24)}}>{t('messenger.dialogsTitle')}</h3>
                    {/*<div style={{*/}
                    {/*    width: '24px',*/}
                    {/*    height: '24px',*/}
                    {/*    display: 'flex',*/}
                    {/*    justifyContent: 'center',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    borderRadius: '50%',*/}
                    {/*    backgroundColor: '#EDF2F7',*/}
                    {/*}}>{unRead}</div>*/}
                </Stack>
                <IconButton onClick={onClickAddDialog} style={{
                    backgroundColor: 'none',
                    color: primaryColor(600),
                    height: 30,
                    width: 30, ...FONT_FAMILY.Lexend(600, 24)
                }}>+</IconButton>
            </Stack>
            <Divider/>
            <SearchInputComponent bgColor={'#F3F3F3'} onChange={setFilter}/>
            <div style={{overflow: 'auto',}}>

                <List sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    backgroundColor: '#FAFAFA',
                    cursor: 'pointer',
                    padding: 0,
                }}>
                    {
                        getDialogs()?.map(dialog =>
                            <ListItem alignItems="center"
                                      ref={selectedDialogId === dialog?._id ? ref : undefined}
                                      onClick={() => onSelectDialog(dialog)}
                                      secondaryAction={<span style={{
                                          ...FONT_FAMILY.Inter(500, 14),
                                          opacity: 0.3,
                                          marginTop: 'auto'
                                      }}>{dialog.last_message_date_sent ? formatDistanceToNow(new Date(dialog.last_message_date_sent * 1000), {addSuffix: true}) : ''}</span>}
                                      sx={{
                                          borderRadius: '12px',
                                          backgroundColor: dialog._id === selectedDialogId ? '#615EF00F' : '#FAFAFA'
                                      }}>
                                <ListItemAvatar>
                                    <Avatar variant={'circular'} src={dialog?.photo}/>
                                </ListItemAvatar>
                                <ListItemText style={{...FONT_FAMILY.Lexend(500, 16), color: '#141414'}} primary={dialog.name}/>
                            </ListItem>
                        )
                    }
                </List>
            </div>
        </Stack>
    );
};

export {DialogList};