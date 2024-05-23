import {IconButton, Paper, Stack} from "@mui/material";
import {GoMakeAutoComplate, GoMakeModal} from "@/components";
import React from "react";
import {AddGroup} from "@/widgets/production-floor/add-group/add-group";
import {useSelectGroup} from "@/widgets/production-floor/select-group/use-select-group";
import {DeleteIcon} from "@/components/icons/delete-icon";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {PrimaryButton} from "@/components/button/primary-button";
import {useTranslation} from "react-i18next";


const SelectGroup = () => {
    const {openAddGroupModal, setOpenAddGroupModal, userGroups, deleteGroup, onSelectGroup, selectedGroup} = useSelectGroup();
    const {secondColor} = useGomakeTheme();
    const {t} = useTranslation();
    return <><GoMakeAutoComplate options={userGroups.map(g => ({label: g.groupName, value: g.id}))}
                                 placeholder={t('productionFloor.groups')}
                                 renderOption={(props: any, option: any) => {
                                     return (
                                         <Stack direction={"row"}>
                                             <div {...props} style={{ width: "100%" }}>
                                                 {option.label}
                                             </div>
                                             <div>
                                                 <IconButton onClick={() => deleteGroup(option.value)}><DeleteIcon color={secondColor(500)} height={20} width={20}/></IconButton>
                                             </div>
                                         </Stack>
                                     );
                                 }}
                                 PaperComponent={(props) => {
                                     return (
                                         <Paper elevation={8} {...props}>
                                             {props?.children}
                                             <PrimaryButton
                                                 sx={{
                                                     width: 'fit-content',
                                                     minWidth: '100%',
                                                     height: '35px',
                                                     marginBottom: '5px'
                                                 }}
                                                 onMouseDown={() => {
                                                     setOpenAddGroupModal(true)
                                                 }}
                                             >
                                                 {t('productionFloor.addGroup')}
                                             </PrimaryButton>
                                         </Paper>
                                     );
                                 }}
                                 style={{width: '200px'}}
                                 value={{label: selectedGroup}}
                                 disableClearable={true}
                                 onChange={(e, v) => {
                                     onSelectGroup(v?.value)
                                 }}/>
        <GoMakeModal onClose={()=>setOpenAddGroupModal(false)} modalTitle={t('productionFloor.addGroup')} openModal={openAddGroupModal} insideStyle={{height: '30%', width: '20%', minWidth: 'fit-content'}}>
            <AddGroup afterAddGroup={() => setOpenAddGroupModal(false)}/>
        </GoMakeModal>
    </>
}
export {SelectGroup}