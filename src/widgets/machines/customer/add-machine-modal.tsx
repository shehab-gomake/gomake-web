import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { printHouseAddNewMachine } from "@/services/api-service/machines/print-house-machines";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { machinesListState } from "@/widgets/machines/state/machines";
import { useTranslation } from "react-i18next";
import { Autocomplete } from "@mui/material";
import { StyledTextField } from "@/components";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";

interface IAddMachine {
    machineName: string;
    category: string;
}

interface IAdminMachine {
    id: string;
    name: string;
    displayName: string;
    manufacturer: string;
    model: string;
    category: string;
    categoryId: string;
}

interface AddMachineModalProps {
    closeModal: () => void;
    allAdminMachines: IAdminMachine[];
    loadAdminMachines: () => Promise<void>;
}

const AddMachineModal = ({ closeModal, allAdminMachines, loadAdminMachines }: AddMachineModalProps) => {
    const { callApi } = useGomakeAxios();
    const router = useRouter();
    const { categoryId } = router.query;
    const [machines, setMachines] = useRecoilState(machinesListState);
    const categories = useRecoilValue(machineCategoriesState);
    const [filteredAdminMachines, setFilteredAdminMachines] = useState<IAdminMachine[]>([]);
    const [state, setState] = useState<IAddMachine>({
        machineName: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [hasLoadedAdminMachines, setHasLoadedAdminMachines] = useState(false);
    const { alertFaultAdded, alertSuccessAdded, setSnackbarStateValue } = useSnackBar();
    const { t } = useTranslation();

    // Get current direction for RTL support
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";

    // Reset loading state when modal opens
    useEffect(() => {
        if (allAdminMachines.length === 0) {
            setLoading(false);
            setHasLoadedAdminMachines(false);
        }
    }, []);

    // Load admin machines when modal is opened (only once)
    useEffect(() => {
        if (!hasLoadedAdminMachines && allAdminMachines.length === 0) {
            setLoading(true);
            loadAdminMachines().then(() => {
                // Use a timeout to wait for the state to update
                setTimeout(() => {
                    if (allAdminMachines.length > 0) {
                        setHasLoadedAdminMachines(true);
                        setLoading(false);
                    } else {
                        // If still no machines after timeout, mark as loaded but show no machines message
                        setHasLoadedAdminMachines(true);
                        setLoading(false);
                    }
                }, 500); // Wait 500ms for state to update
            }).catch(() => {
                setLoading(false);
                setHasLoadedAdminMachines(true);
            });
        } else if (allAdminMachines.length > 0) {
            setHasLoadedAdminMachines(true);
            setLoading(false); // Ensure loading is false when machines are already loaded
        }
    }, [loadAdminMachines, hasLoadedAdminMachines, allAdminMachines.length]);

    // Watch for changes in allAdminMachines and update loading state
    useEffect(() => {
        if (allAdminMachines.length > 0 && loading) {
            setLoading(false);
            setHasLoadedAdminMachines(true);
        }
    }, [allAdminMachines.length, loading]);

    // Filter machines based on search input
    useEffect(() => {
        if (state.machineName.length >= 2) {
            const searchTerm = state.machineName.toLowerCase();
            const filtered = allAdminMachines.filter((machine: IAdminMachine) =>
                machine.displayName?.toLowerCase().includes(searchTerm) ||
                machine.name?.toLowerCase().includes(searchTerm) ||
                machine.manufacturer?.toLowerCase().includes(searchTerm) ||
                machine.model?.toLowerCase().includes(searchTerm)
            );
            setFilteredAdminMachines(filtered);
            console.log('Filtered machines for:', state.machineName, 'Found:', filtered.length);
        } else {
            setFilteredAdminMachines([]);
        }
    }, [state.machineName, allAdminMachines]);

    // Auto-select category when a machine is selected
    const handleMachineSelect = (machine: IAdminMachine) => {
        setState(prevState => ({
            ...prevState,
            machineName: machine.displayName || machine.name,
            category: machine.categoryId || machine.category
        }));
    };

    const onAddMachine = async () => {
        if (!state.machineName || !state.category) {
            setSnackbarStateValue({
                state: true,
                message: t("modal.RequiredFields"),
                type: "error",
            });
            return;
        }

        const callBack = (res) => {
            if (res.success) {
                setMachines([...machines, res.data]);
                alertSuccessAdded();
                closeModal();

                // Navigate to edit view for the newly added machine
                if (res.data && res.data.id) {
                    router.push(`/machines/category/${state.category}?machineId=${res.data.id}`);
                } else {
                    // Fallback: navigate to category without specific machine
                    router.push(`/machines/category/${state.category}`);
                }
            } else {
                alertFaultAdded()
            }
        }

        // Find the selected admin machine to get full details
        const selectedAdminMachine = allAdminMachines.find(machine =>
            machine.id === state.machineName ||
            machine.name === state.machineName ||
            machine.displayName === state.machineName
        );

        if (selectedAdminMachine) {
            // Use the selected admin machine details
            await printHouseAddNewMachine(callApi, callBack, {
                manufacturer: selectedAdminMachine.manufacturer,
                model: selectedAdminMachine.model,
                category: state.category
            });
        } else {
            // Custom machine: use the machine name as both manufacturer and model
            console.log('Adding custom machine:', state.machineName);
            await printHouseAddNewMachine(callApi, callBack, {
                manufacturer: state.machineName,
                model: state.machineName,
                category: state.category
            });
        }
    }

    return (
        <Stack gap={'30px'} style={{ padding: '20px', minWidth: '700px' }}>
            <Stack direction="row" gap={'30px'} alignItems="flex-start">
                {/* Machine Name Field with Search */}
                <Stack gap={'5px'} flex={1}>
                    <h5>{t('machineAttributes.machineName')}</h5>
                    <Autocomplete
                        fullWidth
                        freeSolo
                        loading={loading}
                        options={filteredAdminMachines}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.displayName || option.name || `${option.manufacturer} ${option.model}`;
                        }}
                        onChange={(e, value) => {
                            if (typeof value === 'object' && value) {
                                handleMachineSelect(value);
                            } else if (typeof value === 'string') {
                                setState(prevState => ({ ...prevState, machineName: value }));
                            }
                        }}
                        onInputChange={(e, newInputValue) => {
                            setState(prevState => ({ ...prevState, machineName: newInputValue }));
                        }}
                        sx={{
                            '& .MuiAutocomplete-endAdornment': {
                                right: isRTL ? 'auto !important' : '0 !important',
                                left: isRTL ? '0 !important' : 'auto !important',
                                marginRight: isRTL ? '0 !important' : '6px !important',
                                marginLeft: isRTL ? '6px !important' : '0 !important',
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                right: isRTL ? 'auto !important' : '0 !important',
                                left: isRTL ? '0 !important' : 'auto !important',
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                right: isRTL ? 'auto !important' : '0 !important',
                                left: isRTL ? 'auto !important' : '0 !important',
                                marginRight: isRTL ? '0 !important' : '6px !important',
                                marginLeft: isRTL ? '6px !important' : '0 !important',
                            }
                        }}
                        renderInput={(params) => (
                            <StyledTextField
                                {...params}
                                style={{ height: '40px' }}
                                placeholder={t('machineAttributes.startTypingToSearch')}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <div>
                                    <strong>{option.displayName || option.name || `${option.manufacturer} ${option.model}`}</strong>
                                    <br />
                                    <small>{t('machineAttributes.category')}: {t(option.category)}</small>
                                </div>
                            </li>
                        )}
                    />
                </Stack>

                {/* Category Field (Manual Selection) */}
                <Stack gap={'5px'} flex={1}>
                    <h5>{t('machineAttributes.category')}</h5>
                    <Autocomplete
                        fullWidth
                        options={categories}
                        getOptionLabel={(option) => t(option.name)}
                        value={categories.find(cat => cat.id === state.category) || null}
                        onChange={(e, value) => {
                            setState(prevState => ({
                                ...prevState,
                                category: value ? value.id : ''
                            }));
                        }}
                        sx={{
                            direction: dir,
                            '& .MuiAutocomplete-endAdornment': {
                                right: isRTL ? 'auto !important' : '0 !important',
                                left: isRTL ? '0 !important' : 'auto !important',
                                marginRight: isRTL ? '0 !important' : '6px !important',
                                marginLeft: isRTL ? '6px !important' : '0 !important',
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                right: isRTL ? 'auto !important' : '0 !important',
                                left: isRTL ? '0 !important' : 'auto !important',
                            }
                        }}
                        renderInput={(params) => (
                            <StyledTextField
                                {...params}
                                style={{ height: '40px' }}
                                placeholder={t('machineAttributes.selectCategoryManually')}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flexDirection: isRTL ? 'row-reverse' : 'row'
                                }}>
                                    <div
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: option.color
                                        }}
                                    />
                                    {t(option.name)}
                                </div>
                            </li>
                        )}
                    />
                </Stack>
            </Stack>

            {/* Status Messages */}
            <Stack direction="row" spacing={2} alignItems="center">
                {loading && <small style={{ color: 'gray' }}>{t('machineAttributes.loadingMachines')}</small>}
                {!loading && allAdminMachines.length > 0 && (
                    <small style={{ color: 'green' }}>{t('machineAttributes.loadedAdminMachines', { count: allAdminMachines.length })}</small>
                )}
            </Stack>

            <PrimaryButton
                onClick={onAddMachine}
                variant={'contained'}
                disabled={!state.machineName || !state.category}
                style={{ alignSelf: 'center', minWidth: '120px' }}
            >
                {t('navigationButtons.add')}
            </PrimaryButton>
        </Stack>
    )
}

export { AddMachineModal }