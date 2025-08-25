import Stack from "@mui/material/Stack";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { printHouseAddNewMachine } from "@/services/api-service/machines/print-house-machines";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { adminSearchMachines } from "@/services/api-service/machines/admin-machines";
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
    const [selectedAdminMachine, setSelectedAdminMachine] = useState<IAdminMachine | null>(null);
    const [state, setState] = useState<IAddMachine>({
        machineName: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
    const suppressSearchRef = useRef(false);
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

    // Auto-select category from route when available (edit context)
    useEffect(() => {
        if (categoryId && String(state.category) !== String(categoryId)) {
            setState(prev => ({ ...prev, category: String(categoryId) }));
        }
    }, [categoryId]);

    // Do not preload admin machines; rely on remote search only
    useEffect(() => {
        if (allAdminMachines.length > 0) {
            setHasLoadedAdminMachines(true);
            setLoading(false);
        }
    }, [allAdminMachines.length]);

    // Watch for changes in allAdminMachines and update loading state
    useEffect(() => {
        if (allAdminMachines.length > 0 && loading) {
            setLoading(false);
            setHasLoadedAdminMachines(true);
        }
    }, [allAdminMachines.length, loading]);

    // Filter or search machines based on search input (always use remote endpoint)
    useEffect(() => {
        if (suppressSearchRef.current) {
            suppressSearchRef.current = false;
            return;
        }

        const term = state.machineName.trim();
        setSelectedAdminMachine(null);

        if (term.length < 2) {
            setFilteredAdminMachines([]);
            setAutoCompleteOpen(false);
            return;
        }

        let isActive = true;
        setLoading(true);

        const timer = setTimeout(async () => {
            try {
                await adminSearchMachines(callApi, (res) => {
                    if (!isActive) return;
                    if (res?.success && res?.data) {
                        let machinesData: any[] = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.data?.data || []);

                        // Map simple shape: { name: string, category: string }
                        let mapped: IAdminMachine[] = machinesData
                            .map((machine: any) => {
                                const rawName = typeof machine?.name === 'string' ? machine.name.trim() : '';
                                const categoryIdVal = String(machine?.category || '').trim();
                                if (!rawName) return null;
                                const categoryObj = categories.find((c: any) => String(c.id) === categoryIdVal);
                                const categoryName = categoryObj?.name || '';
                                return {
                                    id: rawName, // no id from API; use name as temporary id
                                    name: rawName,
                                    displayName: rawName,
                                    manufacturer: rawName,
                                    model: rawName,
                                    category: categoryName,
                                    categoryId: categoryIdVal
                                } as IAdminMachine;
                            })
                            .filter(Boolean) as IAdminMachine[];
                        const currentCatId = String(categoryId || state.category || '').trim();
                        if (currentCatId) {
                            mapped = mapped.filter((m: IAdminMachine) => String(m.categoryId) === currentCatId);
                        }
                        setFilteredAdminMachines(mapped);
                        setAutoCompleteOpen(true);
                    } else {
                        setFilteredAdminMachines([]);
                        setAutoCompleteOpen(true);
                    }
                    setLoading(false);
                }, encodeURIComponent(term));
            } catch (e) {
                if (!isActive) return;
                setFilteredAdminMachines([]);
                setAutoCompleteOpen(true);
                setLoading(false);
            }
        }, 350);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [state.machineName, callApi, categories]);

    // Auto-select category when a machine is selected
    const handleMachineSelect = (machine: IAdminMachine) => {
        suppressSearchRef.current = true;
        setState(prevState => ({
            ...prevState,
            machineName: machine.displayName || machine.name,
            category: machine.categoryId || machine.category
        }));
        setSelectedAdminMachine(machine);
        setAutoCompleteOpen(false);
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

        // Try to use the selected machine from state or find it from available lists
        const selected = selectedAdminMachine ||
            allAdminMachines.find(machine =>
                machine.id === state.machineName ||
                machine.name === state.machineName ||
                machine.displayName === state.machineName
            ) ||
            filteredAdminMachines.find(machine =>
                machine.id === state.machineName ||
                machine.name === state.machineName ||
                machine.displayName === state.machineName
            );

        if (selected) {
            // Use the selected admin machine details
            await printHouseAddNewMachine(callApi, callBack, {
                manufacturer: selected.manufacturer,
                model: selected.model,
                category: state.category
            });
        } else {
            // Custom machine: use the machine name as both manufacturer and model
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
                        // Modified: Show dropdown when typing (2+ chars) OR when loading
                        open={autoCompleteOpen && ((state.machineName || '').trim().length >= 2 || loading)}
                        onOpen={() => {
                            // Only open if there's enough input
                            if ((state.machineName || '').trim().length >= 2) {
                                setAutoCompleteOpen(true);
                            }
                        }}
                        onClose={() => setAutoCompleteOpen(false)}
                        options={
                            filteredAdminMachines.length > 0
                                ? filteredAdminMachines
                                : ((state.machineName || '').trim().length >= 2 && !loading
                                    ? [{
                                        id: '__no_data__',
                                        name: t('skeleton.noData'),
                                        displayName: t('skeleton.noData'),
                                        manufacturer: '',
                                        model: '',
                                        category: '',
                                        categoryId: '',
                                        isNoData: true
                                    } as any]
                                    : [])
                        }
                        noOptionsText={t('machineAttributes.noData')}
                        loadingText={t('machineAttributes.loadingMachines')}
                        inputValue={state.machineName}
                        filterOptions={(x) => x} // Keep custom filtering
                        isOptionEqualToValue={(option, value) => (option?.id || option?.name) === (value?.id || value?.name)}
                        getOptionDisabled={(option) => (option as any)?.isNoData === true}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return option.displayName || option.name || `${option.manufacturer} ${option.model}`;
                        }}
                        onChange={(e, value) => {
                            if (typeof value === 'object' && value) {
                                if ((value as any)?.isNoData) {
                                    return;
                                }
                                handleMachineSelect(value);
                            } else if (typeof value === 'string') {
                                setState(prevState => ({ ...prevState, machineName: value }));
                            }
                        }}
                        onInputChange={(e, newInputValue, reason) => {
                            if (reason === 'input') {
                                setState(prevState => ({ ...prevState, machineName: newInputValue }));
                                const hasQuery = (newInputValue || '').trim().length >= 2;

                                // Always open dropdown when user has typed enough characters
                                if (hasQuery) {
                                    setAutoCompleteOpen(true);
                                } else {
                                    setAutoCompleteOpen(false);
                                }
                            } else if (reason === 'clear') {
                                setState(prevState => ({ ...prevState, machineName: '' }));
                                setFilteredAdminMachines([]);
                                setAutoCompleteOpen(false);
                            } else if (reason === 'reset') {
                                // reset happens after selection; ignore to avoid re-search
                            }
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
                        renderOption={(props, option) => {
                            return (
                                <li {...props}>
                                    <div>
                                        <strong>{option.displayName || option.name || `${option.manufacturer} ${option.model}`}</strong>
                                        <br />
                                        {option.id !== '__no_data__' && <small>{t('machineAttributes.category')}: {t(option.category)}</small>}
                                    </div>
                                </li>
                            )
                        }}
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