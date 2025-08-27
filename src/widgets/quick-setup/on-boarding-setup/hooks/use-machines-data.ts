import { useState, useEffect, useCallback } from "react";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { adminGetAllMachineByCategory } from "@/services/api-service/machines/admin-machines";
import {
  Machine,
  FinishingCategory,
} from "@/widgets/quick-setup/on-boarding-setup/types";
import {
  initializeFinishingCategories,
  initializeBookFinishingCategories,
  initializeWideFormatFinishingCategories,
  initializeDtfSublimationFinishingCategories,
  initializeRollFlexoFinishingCategories,
  initializePackagingCategories,
} from "@/widgets/quick-setup/on-boarding-setup/steps-config";

export const useMachinesData = () => {
  const { callApi } = useGomakeAxios();
  const categories = useRecoilValue(machineCategoriesState);

  // State for all machines
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [machinesLoading, setMachinesLoading] = useState(false);

  // State for finishing categories with real machine data
  const [finishingCategories, setFinishingCategories] = useState<
    FinishingCategory[]
  >([]);
  const [bookFinishingCategories, setBookFinishingCategories] = useState<
    FinishingCategory[]
  >([]);
  const [wideFormatFinishingCategories, setWideFormatFinishingCategories] =
    useState<FinishingCategory[]>([]);
  const [
    dtfSublimationFinishingCategories,
    setDtfSublimationFinishingCategories,
  ] = useState<FinishingCategory[]>([]);
  const [rollFlexoFinishingCategories, setRollFlexoFinishingCategories] =
    useState<FinishingCategory[]>([]);
  const [packagingCategories, setPackagingCategories] = useState<
    FinishingCategory[]
  >([]);

  // Load all machines from API
  const loadAllMachines = useCallback(async () => {
    setMachinesLoading(true);
    try {
      const allMachinesData: Machine[] = [];

      for (const category of categories) {
        const callBack = (res: any) => {
          if (res.success) {
            let machinesData: Machine[] = [];

            if (res.data?.data?.data) {
              machinesData = res.data.data.data;
            } else if (res.data?.data) {
              machinesData = res.data.data;
            } else if (Array.isArray(res.data)) {
              machinesData = res.data;
            }

            allMachinesData.push(...machinesData);
          }
        };

        await adminGetAllMachineByCategory(callApi, callBack, category.id);
      }

      setAllMachines(allMachinesData);
      setMachinesLoading(false);
    } catch (error) {
      console.error("Error loading machines:", error);
      setMachinesLoading(false);
    }
  }, [callApi, categories]);

  // Load finishing categories with real machine data
  const loadFinishingCategoriesWithMachines = useCallback(async () => {
    const digitalOffsetCategories = initializeFinishingCategories();
    const bookCategories = initializeBookFinishingCategories();
    const wideFormatCategories = initializeWideFormatFinishingCategories();
    const dtfSublimationCategories =
      initializeDtfSublimationFinishingCategories();
    const rollFlexoCategories = initializeRollFlexoFinishingCategories();
    const packagingCategories = initializePackagingCategories();

    // Function to find machines by category ID
    const findMachinesByCategoryId = (categoryId: string): string[] => {
      const matchingMachines: string[] = [];

      allMachines.forEach((machine) => {
        // Check if machine belongs to this category by categoryId or category field
        const machineCategoryId = machine.categoryId || machine.category;

        if (machineCategoryId === categoryId) {
          const machineName =
            machine.nickName || `${machine.manufacturer} - ${machine.model}`;

          if (!matchingMachines.includes(machineName)) {
            matchingMachines.push(machineName);
          }
        }
      });

      return matchingMachines;
    };

    // Populate machines for digital/offset categories
    const populatedDigitalOffsetCategories = digitalOffsetCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryId(category.id),
      })
    );

    // Populate machines for book finishing categories
    const populatedBookCategories = bookCategories.map((category) => ({
      ...category,
      machines: findMachinesByCategoryId(category.id),
    }));

    // Populate machines for wide format categories
    const populatedWideFormatCategories = wideFormatCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryId(category.id),
      })
    );

    // Populate machines for DTF/sublimation categories
    const populatedDtfSublimationCategories = dtfSublimationCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryId(category.id),
      })
    );

    // Populate machines for roll/flexo categories
    const populatedRollFlexoCategories = rollFlexoCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryId(category.id),
      })
    );

    // Populate machines for packaging categories
    const populatedPackagingCategories = packagingCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryId(category.id),
      })
    );

    setFinishingCategories(populatedDigitalOffsetCategories);
    setBookFinishingCategories(populatedBookCategories);
    setWideFormatFinishingCategories(populatedWideFormatCategories);
    setDtfSublimationFinishingCategories(populatedDtfSublimationCategories);
    setRollFlexoFinishingCategories(populatedRollFlexoCategories);
    setPackagingCategories(populatedPackagingCategories);
  }, [allMachines]);

  // Initialize data on mount
  useEffect(() => {
    loadAllMachines();
  }, [loadAllMachines]);

  // Load finishing categories when machines are loaded
  useEffect(() => {
    if (allMachines.length > 0) {
      loadFinishingCategoriesWithMachines();
    }
  }, [allMachines, loadFinishingCategoriesWithMachines]);

  return {
    allMachines,
    machinesLoading,
    finishingCategories,
    bookFinishingCategories,
    wideFormatFinishingCategories,
    dtfSublimationFinishingCategories,
    rollFlexoFinishingCategories,
    packagingCategories,
    loadAllMachines,
    loadFinishingCategoriesWithMachines,
  };
};
