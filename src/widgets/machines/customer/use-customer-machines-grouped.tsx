import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { useTranslation } from "react-i18next";
import { getAllPrintHouseMachines, getCategoryMachinesList } from "@/services/api-service/machines/print-house-machines";

interface IMachine {
    id: string;
    manufacturer: string;
    model: string;
    nickName?: string;
    category: string;
}

interface ICategoryWithMachines {
    id: string;
    name: string;
    color: string;
    machines: IMachine[];
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

const useCustomerMachinesGrouped = () => {
    const [filter, setFilter] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const categoriesList = useRecoilValue(machineCategoriesState);
    const [categoriesWithMachines, setCategoriesWithMachines] = useState<ICategoryWithMachines[]>([]);
    const [allMachines, setAllMachines] = useState<IMachine[]>([]);
    const [hasLoadedMachines, setHasLoadedMachines] = useState(false);
    const [allAdminMachines, setAllAdminMachines] = useState<IAdminMachine[]>([]);
    const [hasLoadedAdminMachines, setHasLoadedAdminMachines] = useState(false);

    // Manual category mapping based on machine names and patterns
    const mapMachineToCategory = useCallback((machine: any, categories: any[]) => {
        const machineName = (machine.nickName || machine.name || machine.model || '').toLowerCase();
        const manufacturer = (machine.manufacturer || '').toLowerCase();

        // Try to match by exact category field first
        if (machine.category) return machine.category;
        if (machine.categoryId) return machine.categoryId;
        if (machine.machineCategory) return machine.machineCategory;
        if (machine.machineCategoryId) return machine.machineCategoryId;
        if (machine.type) return machine.type;
        if (machine.typeId) return machine.typeId;

        // Manual mapping based on machine names and patterns
        for (const category of categories) {
            const categoryName = t(category.name).toLowerCase();

            // Check if machine name contains category name
            if (machineName.includes(categoryName) || categoryName.includes(machineName)) {
                return category.id;
            }

            // Check for specific patterns
            if (categoryName.includes('digital') && (machineName.includes('digital') || machineName.includes('printer'))) {
                return category.id;
            }
            if (categoryName.includes('offset') && machineName.includes('offset')) {
                return category.id;
            }
            if (categoryName.includes('flexo') && machineName.includes('flexo')) {
                return category.id;
            }
            if (categoryName.includes('wide') && machineName.includes('wide')) {
                return category.id;
            }
            if (categoryName.includes('lamination') && machineName.includes('lamination')) {
                return category.id;
            }
            if (categoryName.includes('punching') && (machineName.includes('punch') || machineName.includes('drill'))) {
                return category.id;
            }
            if (categoryName.includes('rounding') && machineName.includes('rounding')) {
                return category.id;
            }
            if (categoryName.includes('folding') && machineName.includes('fold')) {
                return category.id;
            }
            if (categoryName.includes('pasting') && machineName.includes('pasting')) {
                return category.id;
            }
            if (categoryName.includes('scoring') && (machineName.includes('score') || machineName.includes('perforation'))) {
                return category.id;
            }
            if (categoryName.includes('enhancement') && machineName.includes('enhancement')) {
                return category.id;
            }
            if (categoryName.includes('die') && machineName.includes('die')) {
                return category.id;
            }
            if (categoryName.includes('encapsulation') && machineName.includes('encapsulation')) {
                return category.id;
            }
            if (categoryName.includes('coloring') && machineName.includes('coloring')) {
                return category.id;
            }
            if (categoryName.includes('guillotine') && machineName.includes('guillotine')) {
                return category.id;
            }
            if (categoryName.includes('cnc') && machineName.includes('cnc')) {
                return category.id;
            }
            if (categoryName.includes('plotter') && machineName.includes('plotter')) {
                return category.id;
            }
            if (categoryName.includes('stapler') && machineName.includes('stapler')) {
                return category.id;
            }
            if (categoryName.includes('peeling') && machineName.includes('peeling')) {
                return category.id;
            }
            if (categoryName.includes('eyelet') && machineName.includes('eyelet')) {
                return category.id;
            }
            if (categoryName.includes('linkage') && machineName.includes('linkage')) {
                return category.id;
            }
            if (categoryName.includes('bending') && machineName.includes('bending')) {
                return category.id;
            }
            if (categoryName.includes('collector') && machineName.includes('collector')) {
                return category.id;
            }
            if (categoryName.includes('booklet') && machineName.includes('booklet')) {
                return category.id;
            }
            if (categoryName.includes('binding') && machineName.includes('binding')) {
                return category.id;
            }
            if (categoryName.includes('sewing') && machineName.includes('sewing')) {
                return category.id;
            }
            if (categoryName.includes('spiral') && machineName.includes('spiral')) {
                return category.id;
            }
            if (categoryName.includes('hardcover') && machineName.includes('hardcover')) {
                return category.id;
            }
            if (categoryName.includes('pressing') && machineName.includes('pressing')) {
                return category.id;
            }
            if (categoryName.includes('packaging') && (machineName.includes('package') || machineName.includes('shrink'))) {
                return category.id;
            }
            if (categoryName.includes('tying') && machineName.includes('tying')) {
                return category.id;
            }
            if (categoryName.includes('casing') && machineName.includes('casing')) {
                return category.id;
            }
            if (categoryName.includes('cartoon') && machineName.includes('cartoon')) {
                return category.id;
            }
            if (categoryName.includes('finish') && machineName.includes('finish')) {
                return category.id;
            }
            if (categoryName.includes('sheeter') && machineName.includes('sheeter')) {
                return category.id;
            }
            if (categoryName.includes('trimmer') && machineName.includes('trimmer')) {
                return category.id;
            }
            if (categoryName.includes('processor') && machineName.includes('processor')) {
                return category.id;
            }
            if (categoryName.includes('dies') && machineName.includes('dies')) {
                return category.id;
            }
            if (categoryName.includes('silk') && machineName.includes('silk')) {
                return category.id;
            }
            if (categoryName.includes('card') && machineName.includes('card')) {
                return category.id;
            }
        }

        // If no match found, return empty string
        return '';
    }, [t]);

    // Fetch all machines at once and group them by category
    const fetchAllMachines = useCallback(async () => {
        setLoading(true);
        try {
            const callBack = (res: any) => {
                if (res.success) {
                    // Handle different response structures
                    let machines = [];
                    if (res?.data?.data?.data) {
                        // Structure: res.data.data.data
                        machines = res.data.data.data;
                    } else if (res?.data?.data) {
                        // Structure: res.data.data
                        machines = res.data.data;
                    } else if (res?.data) {
                        // Structure: res.data
                        machines = res.data;
                    } else if (Array.isArray(res)) {
                        // Structure: res (direct array)
                        machines = res;
                    }

                    if (machines && Array.isArray(machines) && machines.length > 0) {
                        // First, let's see what fields are actually available in the machine data


                        const machinesWithCategory = machines.map((machine: any) => {
                            const categoryId = mapMachineToCategory(machine, categoriesList);

                            // Try to get the best machine name from available fields
                            let machineName = '';
                            let manufacturer = '';
                            let model = '';

                            // Try different field names for machine name
                            if (machine.nickName) machineName = machine.nickName;
                            else if (machine.name) machineName = machine.name;
                            else if (machine.machineName) machineName = machine.machineName;
                            else if (machine.title) machineName = machine.title;
                            else if (machine.label) machineName = machine.label;

                            // Try different field names for manufacturer
                            if (machine.manufacturer) manufacturer = machine.manufacturer;
                            else if (machine.manufacturerName) manufacturer = machine.manufacturerName;
                            else if (machine.brand) manufacturer = machine.brand;
                            else if (machine.company) manufacturer = machine.company;

                            // Try different field names for model
                            if (machine.model) model = machine.model;
                            else if (machine.modelName) model = machine.modelName;
                            else if (machine.type) model = machine.type;
                            else if (machine.series) model = machine.series;

                            // If still no machine name, combine manufacturer and model
                            if (!machineName && (manufacturer || model)) {
                                machineName = [manufacturer, model].filter(Boolean).join(' - ');
                            }

                            // Fallback: use any available text field
                            if (!machineName) {
                                const textFields = ['description', 'notes', 'comment', 'info'];
                                for (const field of textFields) {
                                    if (machine[field]) {
                                        machineName = machine[field];
                                        break;
                                    }
                                }
                            }

                            // Last resort: use ID if nothing else works
                            if (!machineName) {
                                machineName = `Machine ${machine.id || 'Unknown'}`;
                            }

                            return {
                                id: machine.id || machine.machineId || '',
                                manufacturer: manufacturer,
                                model: model,
                                nickName: machineName,
                                category: categoryId
                            };
                        });


                        setAllMachines(machinesWithCategory);

                        // Group machines by category
                        const groupedByCategory = categoriesList.map(category => {
                            const categoryMachines = machinesWithCategory.filter(
                                machine => machine.category === category.id
                            );



                            return {
                                id: category.id,
                                name: category.name,
                                color: category.color,
                                machines: categoryMachines
                            };
                        }).filter(category => category.machines.length > 0); // Only categories with machines


                        setCategoriesWithMachines(groupedByCategory);
                        setHasLoadedMachines(true); // Mark that we've successfully loaded machines
                    } else {

                        setCategoriesWithMachines([]);
                    }
                } else {

                    setCategoriesWithMachines([]);
                }
                setLoading(false);
            };

            await getAllPrintHouseMachines(callApi, callBack, false);

        } catch (error) {

            setLoading(false);
            setCategoriesWithMachines([]);
        }
    }, [categoriesList, callApi, mapMachineToCategory]);

    // Load admin machines in the background for the Add Machine modal
    const loadAdminMachines = useCallback(async () => {
        if (hasLoadedAdminMachines) {

            return;
        }


        setHasLoadedAdminMachines(true); // Mark as loading to prevent duplicate calls

        try {
            const allMachines: IAdminMachine[] = [];

            // Load machines from each category individually
            for (const category of categoriesList) {
                try {


                    // Import the function dynamically to avoid circular dependencies
                    const { adminGetAllMachineByCategory } = await import("@/services/api-service/machines/admin-machines");

                    await new Promise((resolve) => {
                        adminGetAllMachineByCategory(callApi, (res) => {


                            if (res.success && res.data) {
                                // Handle different possible response structures
                                let machinesData = [];

                                if (res.data.data?.data) {
                                    machinesData = res.data.data.data;
                                } else if (res.data.data) {
                                    machinesData = res.data.data;
                                } else if (Array.isArray(res.data)) {
                                    machinesData = res.data;
                                }

                                if (machinesData.length > 0) {
                                    const categoryMachines = machinesData.map((machine: any) => {

                                        // Build display name from manufacturer and model
                                        const manufacturer = machine.manufacturer || machine.manufacturerName || machine.manufacturerName || '';
                                        const model = machine.model || machine.modelName || machine.modelName || '';
                                        const displayName = manufacturer && model ? `${manufacturer} ${model}` :
                                            manufacturer || model || machine.name || machine.nickName || 'Unknown Machine';

                                        return {
                                            id: machine.id,
                                            name: machine.name || machine.nickName || displayName,
                                            displayName: displayName,
                                            manufacturer: manufacturer,
                                            model: model,
                                            category: category.name,
                                            categoryId: category.id
                                        };
                                    });

                                    allMachines.push(...categoryMachines);
                                }
                            } else {
                            }
                            resolve(true);
                        }, category.id);
                    });

                } catch (error) {
                }
            }

            setAllAdminMachines(allMachines);

            // If no machines found, add some test data for debugging
            if (allMachines.length === 0) {

                const testMachines: IAdminMachine[] = [
                    {
                        id: 'test1',
                        name: 'Test Machine 1',
                        displayName: 'HP Indigo 12000',
                        manufacturer: 'HP',
                        model: 'Indigo 12000',
                        category: 'Digital Printing',
                        categoryId: 'digital-printing'
                    },
                    {
                        id: 'test2',
                        name: 'Test Machine 2',
                        displayName: 'Heidelberg Speedmaster',
                        manufacturer: 'Heidelberg',
                        model: 'Speedmaster',
                        category: 'Offset Printing',
                        categoryId: 'offset-printing'
                    }
                ];
                setAllAdminMachines(testMachines);
            }
        } catch (error) {
        }
    }, [categoriesList, callApi, hasLoadedAdminMachines]);

    // Fallback: Try to fetch machines by category if the main approach fails
    const fetchMachinesByCategory = useCallback(async () => {
        // Only run fallback if we haven't successfully loaded machines yet
        if (hasLoadedMachines) {
            return;
        }

        setLoading(true);

        try {
            const machinesPromises = categoriesList.map(async (category) => {
                try {
                    const result = await callApi("Get", `/v1/machines-list/category/${category.id}`);

                    // Handle different response structures
                    let machines = [];
                    if (result?.data?.data?.data) {
                        machines = result.data.data.data;
                    } else if (result?.data?.data) {
                        machines = result.data.data;
                    } else if (result?.data) {
                        machines = result.data;
                    } else if (Array.isArray(result)) {
                        machines = result;
                    }


                    if (machines && Array.isArray(machines) && machines.length > 0) {
                        return {
                            categoryId: category.id,
                            machines: machines.map((machine: any) => ({
                                id: machine.id || machine.machineId || '',
                                manufacturer: machine.manufacturer || machine.manufacturerName || '',
                                model: machine.model || machine.modelName || '',
                                nickName: machine.nickName || machine.nick_name || machine.name || '',
                                category: category.id
                            }))
                        };
                    }
                    return { categoryId: category.id, machines: [] };
                } catch (error) {
                    return { categoryId: category.id, machines: [] };
                }
            });

            const results = await Promise.all(machinesPromises);

            const allMachinesData = results.flatMap(result => result.machines);
            setAllMachines(allMachinesData);

            // Group machines by category and only include categories with machines
            const groupedCategories = results
                .filter(result => result.machines.length > 0) // Only categories with machines
                .map(result => {
                    const category = categoriesList.find(cat => cat.id === result.categoryId);
                    if (!category) return null;

                    return {
                        id: category.id,
                        name: category.name,
                        color: category.color,
                        machines: result.machines
                    };
                })
                .filter(Boolean) as ICategoryWithMachines[];

            setCategoriesWithMachines(groupedCategories);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [categoriesList, callApi, hasLoadedMachines]);

    useEffect(() => {
        // Only run the main fetch once
        if (!hasLoadedMachines) {
            fetchAllMachines();
        }
    }, [fetchAllMachines, hasLoadedMachines]);

    const onFilterChange = (e: string) => setFilter(e);

    // Filter categories based on search only (no status filtering)
    const filteredCategories = useMemo(() => {
        if (!filter) {
            return categoriesWithMachines;
        }

        return categoriesWithMachines.filter(category => {
            const categoryName = t(category.name).toLowerCase();
            const hasMatchingCategory = categoryName.includes(filter.toLowerCase());
            const hasMatchingMachines = category.machines.some(machine =>
                machine.manufacturer.toLowerCase().includes(filter.toLowerCase()) ||
                machine.model.toLowerCase().includes(filter.toLowerCase()) ||
                (machine.nickName && machine.nickName.toLowerCase().includes(filter.toLowerCase()))
            );

            return hasMatchingCategory || hasMatchingMachines;
        });
    }, [categoriesWithMachines, filter, t]);

    // Menu handling (simplified - no status filtering)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return {
        categoriesWithMachines: filteredCategories, // Use filtered categories directly
        onFilterChange,
        loading,
        allMachines,
        filter, // Expose filter state
        refreshMachines: fetchAllMachines,
        allAdminMachines, // Expose admin machines for the Add Machine modal
        loadAdminMachines // Expose function to load admin machines on demand
    };
};

export { useCustomerMachinesGrouped };
