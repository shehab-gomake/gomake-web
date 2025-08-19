import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useCustomerMachinesGrouped } from "./use-customer-machines-grouped";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { StepType } from "@reactour/tour";
import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import i18n from "i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useState } from "react";
import { GoMakeModal } from "@/components";
import { AddMachineModal } from "@/widgets/machines/customer/add-machine-modal";

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
        loadAdminMachines
    } = useCustomerMachinesGrouped();

    const [openAddMachineModal, setOpenAddMachineModal] = useState(false);
    const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({});

    const handleEditMachine = (categoryId: string, machineId: string) => {
        router.push(`/machines/category/${categoryId}?machineId=${machineId}`);
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
                                                            <PrimaryButton
                                                                data-tour={category.id === 'digital-printing' ? 'editDigitalPrinting' : undefined}
                                                                startIcon={<EditIcon color={primaryColor(500)} width={16} height={16} />}
                                                                onClick={() => handleEditMachine(category.id, machine.id)}
                                                                variant={"text"}
                                                                size="small"
                                                            >
                                                                {t('machineAttributes.edit')}
                                                            </PrimaryButton>
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
        </div>
    );
};

export { CustomerMachinesGrouped };
