import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
} from "@/widgets/quick-setup/on-boarding-setup/steps-config";

export const useMachinesData = () => {
  const { t } = useTranslation();
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

    // Map finishing category names to machine category names for API lookup
    const categoryNameMapping: { [key: string]: string[] } = {
      CNC: ["CNC", "Digital Diecut", "Diecut"],
      Guillotine: ["Guillotine", "Cutting"],
      "Diecut analog": ["Diecut", "Analog Diecut"],
      "Punching/Driling": ["Punching", "Drilling", "Punch"],
      "Rounding corners": ["Rounding", "Corner Rounding"],
      Folding: ["Folding", "Folder"],
      "Pasting Blocks": ["Pasting", "Gluing", "Adhesive"],
      "Scoring & Perforation": ["Scoring", "Perforation", "Score"],
      "Folding and gluining": ["Folding", "Gluing", "Folder"],
      "Digital Foil": ["Foil", "Digital Enhancement"],
      "Foil/Embossing stamp": ["Foil", "Embossing", "Stamp"],
      "Digital Selective Lamination": ["Lamination", "Selective Lamination"],
      Encapsulation: ["Encapsulation", "Sheet Encapsulation"],
      "Manual Sewing": ["Sewing", "Manual Sewing"],
      "Card cutting": ["Card Cutting", "Cutting"],
      Embroidery: ["Embroidery"],
      "Cartoon cups": ["Cartoon", "Cups"],
      Linkage: ["Linkage", "Cold Lamination"],
      "Cartoon packaging machine": ["Carton Packaging", "Packaging"],
      "Package tying machine": ["Package Tying", "Tying"],
      "Shrink packaging machine": ["Shrink Packaging", "Shrink"],
      "Plate processor": ["Plate Processor", "Plates"],
      // Book finishing categories
      Booklet: ["Booklet", "Booklet Making", "Booklet Machine"],
      "Perfect Binding": ["Perfect Binding", "Perfect Bind", "Binding"],
      "Books Sewing": ["Books Sewing", "Book Sewing", "Sewing"],
      Spiral: ["Spiral", "Spiral Binding", "Spiral Bind"],
      "Manual Stapler": ["Manual Stapler", "Stapler", "Stapling"],
      "Hardcover Cover": ["Hardcover Cover", "Hardcover", "Cover"],
      "Three Knife Trimmer": ["Three Knife Trimmer", "Trimmer", "Cutting"],
      Collector: ["Collector", "Collection"],
      // Wide format categories
      "Manual cutting": ["Manual Cutting", "Cutting"],
      "Stickers Peeling": ["Stickers Peeling", "Peeling"],
      "Ring eyelet punching": ["Ring Eyelet", "Eyelet", "Punching"],
      "PVC Bending": ["PVC Bending", "Bending"],
      "Letter sides bending": ["Letter Sides", "Bending"],
      "Light boxes & letter assembly": ["Light Boxes", "Letter Assembly"],
      "Cold Lamination": ["Cold Lamination", "Lamination"],
      // DTF & Sublimation categories
      "Silk mesh procesor": ["Silk Mesh", "Mesh Processor"],
      "Silk printer": ["Silk Printer", "Printer"],
      "Press machine": ["Press Machine", "Press"],
      // Roll/Flexo categories
      Lamination: ["Lamination", "Laminating"],
      Varnish: ["Varnish", "Varnishing"],
      Embossing: ["Embossing", "Emboss"],
      "Selective Coating": ["Selective Coating", "Coating"],
      "Roll Sheeter/Slitter": ["Roll Sheeter", "Slitter", "Sheeter"],
    };

    // Function to find machines by category name
    const findMachinesByCategoryName = (categoryName: string): string[] => {
      const searchTerms = categoryNameMapping[categoryName] || [categoryName];
      const matchingMachines: string[] = [];

      allMachines.forEach((machine) => {
        const machineName =
          machine.nickName || `${machine.manufacturer} - ${machine.model}`;
        const isMatch = searchTerms.some((term) =>
          machineName.toLowerCase().includes(term.toLowerCase())
        );

        if (isMatch && !matchingMachines.includes(machineName)) {
          matchingMachines.push(machineName);
        }
      });

      return matchingMachines;
    };

    // Populate machines for digital/offset categories
    const populatedDigitalOffsetCategories = digitalOffsetCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryName(category.name),
      })
    );

    // Populate machines for book finishing categories
    const populatedBookCategories = bookCategories.map((category) => ({
      ...category,
      machines: findMachinesByCategoryName(category.name),
    }));

    // Populate machines for wide format categories
    const populatedWideFormatCategories = wideFormatCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryName(category.name),
      })
    );

    // Populate machines for DTF/sublimation categories
    const populatedDtfSublimationCategories = dtfSublimationCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryName(category.name),
      })
    );

    // Populate machines for roll/flexo categories
    const populatedRollFlexoCategories = rollFlexoCategories.map(
      (category) => ({
        ...category,
        machines: findMachinesByCategoryName(category.name),
      })
    );

    setFinishingCategories(populatedDigitalOffsetCategories);
    setBookFinishingCategories(populatedBookCategories);
    setWideFormatFinishingCategories(populatedWideFormatCategories);
    setDtfSublimationFinishingCategories(populatedDtfSublimationCategories);
    setRollFlexoFinishingCategories(populatedRollFlexoCategories);
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
    loadAllMachines,
    loadFinishingCategoriesWithMachines,
  };
};
