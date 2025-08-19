import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useCustomerMachinesGrouped } from "./use-customer-machines-grouped";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { StepType } from "@reactour/tour";
import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/icons/edit-icon";
import { TrashIcon } from "@/components/icons/trash-icon";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import i18n from "i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeModal, GoMakeDeleteModal } from "@/components";
import { AddMachineModal } from "@/widgets/machines/customer/add-machine-modal";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { machineState } from "@/widgets/machines/state/machine-state";
import { ModalType } from "@/enums";

const CustomerMachinesGrouped = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const isRTL = i18n.dir() === 'rtl';
    const router = useRouter();
    const {
        categoriesWithMachines,
        onFilterChange,
        loading,
        allMachines,
        filter,
        allAdminMachines,
        loadAdminMachines,
        refreshMachines
    } = useCustomerMachinesGrouped();

    const [openAddMachineModal, setOpenAddMachineModal] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});
    
    // State for delete confirmation modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState<any>(null);
    

    
    // Get machine functions
    const { duplicateMachine, deleteMachine } = usePrintHouseAddMachine();
    
    // API and alert hooks
    const { callApi } = useGomakeAxios();
    const { alertSuccessDelete, alertFaultDelete } = useSnackBar();
    
    // Recoil state for machine operations
    const selectedMachine = useRecoilValue(machineState);
    const setMachineState = useSetRecoilState(machineState);

    const handleEditMachine = (categoryId: string, machineId: string) => {
        router.push(`/machines/category/${categoryId}?machineId=${machineId}`);
    };



    const handleDeleteMachine = (machine: any) => {
        setMachineToDelete(machine);
        setDeleteModalOpen(true);
    };

    const confirmDeleteMachine = async () => {
        if (machineToDelete) {
            try {
                // Call the delete API directly with the machine ID
                const response = await callApi(
                    'POST',
                    `/v1/delete-machine`,
                    { id: machineToDelete.id }
                );
                
                if (response?.success) {
                    alertSuccessDelete();
                    setDeleteModalOpen(false);
                    setMachineToDelete(null);
                    
                    // Refresh the machines list to reflect the deletion
                    await refreshMachines();
                } else {
                    alertFaultDelete();
                }
            } catch (error) {
                console.error('Error deleting machine:', error);
                alertFaultDelete();
            }
        }
    };



    const machinesTableSteps: StepType[] = [
        {
            selector: '[data-tour="machinesTable"]',
            content: 'This view shows all your machines grouped by categories.\n',
            position: 'right',
        },
        {
            selector: '[data-tour="editDigitalPrinting"]',
            content: 'Click on "Edit" to manage machines in each category.',
            position: 'top',
        },
    ];
    
    const { } = useGoMakeTour(machinesTableSteps, []);
    
    if (loading) {
        return (
            <div style={classes.mainContainer}>
                <Typography>{t('machineAttributes.loadingMachines')}</Typography>
            </div>
        );
    }
    
    return (
        <div style={classes.mainContainer}>
            <HeaderTitleWithSearch
                title={t("machineAttributes.machines")}
                onChange={onFilterChange}
                children={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <SecondaryButton
                            onClick={() => setOpenAddMachineModal(true)}
                            variant={'contained'}
                            style={{
                                height: '40px',
                                minWidth: '220px'
                            }}
                        >
                            {t('tabs.addMachine')}
                        </SecondaryButton>
                    </div>
                }
            />
            
            <div style={{ width: '100%' }} data-tour={'machinesTable'}>
                {categoriesWithMachines.length === 0 ? (
                    <Box>
                        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '1rem' }}>
                            {filter ? t("machineAttributes.noSearchResults") : t("machineAttributes.noMachinesFound")}
                        </Typography>
                        <Typography variant="body2" style={{ textAlign: 'center', marginTop: '0.5rem', color: 'gray' }}>
                            {filter ? t("machineAttributes.tryDifferentSearch") : t("machineAttributes.noMachinesInSystem")}
                        </Typography>
                    </Box>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {categoriesWithMachines.map((category) => (
                            <Card key={category.id} style={{ 
                                borderLeft: isRTL ? 'none' : `4px solid ${category.color}`,
                                borderRight: isRTL ? `4px solid ${category.color}` : 'none'
                            }}>
                                <CardContent style={{ padding: '0.75rem' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <span 
                                                style={{ 
                                                    cursor: 'pointer',
                                                    fontSize: '18px',
                                                    color: '#666',
                                                    padding: '4px',
                                                    userSelect: 'none'
                                                }}
                                                onClick={() => {
                                                    setCollapsedCategories(prev => ({
                                                        ...prev,
                                                        [category.id]: !prev[category.id]
                                                    }));
                                                }}
                                            >
                                                {collapsedCategories[category.id] ? '▶' : '▼'}
                                            </span>
                                            <Typography variant="h6" component="h3">
                                                {t(category.name)}
                                            </Typography>
                                        </Box>
                                        <Chip 
                                            label={`${category.machines.length} ${t("machineAttributes.machines")}`}
                                            color="primary"
                                            size="small"
                                        />
                                    </Box>
                                    
                                    {!collapsedCategories[category.id] && (
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box display="flex" flexDirection="column" gap={0.5} flex={1}>
                                                {category.machines.map((machine) => (
                                                    <Box 
                                                        key={machine.id} 
                                                        display="flex" 
                                                        justifyContent="space-between" 
                                                        alignItems="center"
                                                        p={0.5}
                                                        sx={{ 
                                                            backgroundColor: 'rgba(0,0,0,0.02)', 
                                                            borderRadius: 1,
                                                            border: '1px solid rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Typography 
                                                            variant="body1" 
                                                            style={{ 
                                                                fontWeight: 600, 
                                                                color: '#000000',
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            {machine.nickName}
                                                        </Typography>
                                                        <PermissionCheck userPermission={Permissions.EDIT_MACHINE}>
                                                            <Box display="flex" gap={1}>
                                                                <PrimaryButton
                                                                    data-tour={category.id === 'digital-printing' ? 'editDigitalPrinting' : undefined}
                                                                    startIcon={<EditIcon color={primaryColor(500)} width={16} height={16} />}
                                                                    onClick={() => handleEditMachine(category.id, machine.id)}
                                                                    variant={"text"}
                                                                    size="small"
                                                                >
                                                                    {t('machineAttributes.edit')}
                                                                </PrimaryButton>
                                                                                                                                                                                                   
                                                                                                                                   <SecondaryButton
                                                                      onClick={() => handleDeleteMachine(machine)}
                                                                      variant={"outlined"}
                                                                      size="small"
                                                                      style={{ minWidth: '45px', width: '45px', padding: '4px', color: '#d32f2f', borderColor: '#d32f2f' }}
                                                                  >
                                                                     <TrashIcon color="#d32f2f" width={20} height={20} />
                                                                 </SecondaryButton>
                                                            </Box>
                                                        </PermissionCheck>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            <GoMakeModal 
                insideStyle={{ width: '800px', height: 'fit-content' }} 
                openModal={openAddMachineModal} 
                onClose={() => setOpenAddMachineModal(false)} 
                modalTitle={t('tabs.addMachine')}
            >
                <AddMachineModal 
                    closeModal={() => setOpenAddMachineModal(false)} 
                    allAdminMachines={allAdminMachines}
                    loadAdminMachines={loadAdminMachines}
                />
            </GoMakeModal>

                         {/* Delete Confirmation Modal */}
             <GoMakeModal
                 openModal={deleteModalOpen}
                 onClose={() => setDeleteModalOpen(false)}
                                   insideStyle={{ 
                      width: '500px', 
                      height: 'fit-content',
                      padding: '24px',
                      textAlign: 'center'
                  }}
             >
                 <Box sx={{ position: 'relative' }}>
                     
                     
                     {/* Trash Icon */}
                     <Box sx={{ textAlign: 'center', mb: 2 }}>
                         <TrashIcon color="#d32f2f" width={48} height={48} />
                     </Box>
                     
                     {/* Title */}
                     <Typography 
                         variant="h6" 
                         sx={{ 
                             fontWeight: 600, 
                             color: '#333',
                             mb: 2 
                         }}
                     >
                         {t('machineAttributes.deleteMachine')}
                     </Typography>
                     
                     {/* Message */}
                     <Typography 
                         variant="body2" 
                         sx={{ 
                             color: '#666',
                             mb: 3,
                             lineHeight: 1.5
                         }}
                     >
                         {t('machineAttributes.deleteMachineConfirmation', { 
                             machineName: machineToDelete?.nickName || machineToDelete?.name || 'this machine' 
                         })}
                         <br />
                         {t('machineAttributes.deleteMachineWarning')}
                     </Typography>
                     
                     {/* Action Buttons */}
                     <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                         <SecondaryButton
                             onClick={() => setDeleteModalOpen(false)}
                             variant="outlined"
                             sx={{
                                 minWidth: '100px',
                                 borderColor: '#ccc',
                                 color: '#333',
                                 '&:hover': {
                                     borderColor: '#999',
                                     backgroundColor: '#f5f5f5'
                                 }
                             }}
                         >
                             {t('navigationButtons.cancel')}
                         </SecondaryButton>
                         <SecondaryButton
                             onClick={confirmDeleteMachine}
                             variant="contained"
                             sx={{
                                 minWidth: '100px',
                                 backgroundColor: '#d32f2f',
                                 color: 'white',
                                 '&:hover': {
                                     backgroundColor: '#b71c1c'
                                 }
                             }}
                         >
                             {t('machineAttributes.delete')}
                         </SecondaryButton>
                     </Box>
                 </Box>
             </GoMakeModal>

            
        </div>
    );
};

export { CustomerMachinesGrouped };
