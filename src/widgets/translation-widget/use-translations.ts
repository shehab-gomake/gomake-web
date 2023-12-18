import { useSnackBar } from "@/hooks";
import { useState } from "react";

const useTranslations = () => {
  const {alertFaultAdded} = useSnackBar();
  const [state, setState] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [translationFiles, setTranslationFiles] = useState({
    en: [],
    he: [],
    ar: [],
    de: [],
  });

  const handleEdit = (translationFiles, state) => {
    const updateFile = (langFile, langKey) => {
      const newLangFile = { ...langFile };
      let currentObj = newLangFile;

      for (const pathKey of state?.path) {
        currentObj = currentObj[pathKey];
      }

      const newValue = state?.[langKey];

      // Check if newValue is not empty before setting the value
      if (newValue !== undefined && newValue !== null && newValue !== '') {
        currentObj[state?.key] = newValue;
      }

      return newLangFile;
    };

    const newEnFile = updateFile(translationFiles.en, 'en');
    const newArFile = updateFile(translationFiles.ar, 'ar');
    const newHeFile = updateFile(translationFiles.he, 'he');
    const newDeFile = updateFile(translationFiles.de, 'de');

    //must replace with updateTranslations Files func
    console.log('New English File:', newEnFile);
    console.log('New Arabic File:', newArFile);
    console.log('New Hebrew File:', newHeFile);
    console.log('New Deutsche File:', newDeFile);
  };

  const handleAdd = (translationFiles, state) => {
    const updateFile = (langFile, langKey) => {
      const newLangFile = { ...langFile };
      let currentObj = newLangFile;

      for (const pathKey of state?.path) {
        if (!currentObj[pathKey]) {
          currentObj[pathKey] = {};
        }
        currentObj = currentObj[pathKey];
      }

      const newKey = state?.key;
      const newValue = state?.[langKey] ?? ''

      if (newValue !== null && newValue !== undefined) {
        currentObj[newKey] = newValue;
      }
      return newLangFile;
    };

    const newEnFile = updateFile(translationFiles.en, 'en');
    const newArFile = updateFile(translationFiles.ar, 'ar');
    const newHeFile = updateFile(translationFiles.he, 'he');
    const newDeFile = updateFile(translationFiles.de, 'de');

    //must replace with updateTranslations func
    console.log('New English File:', newEnFile);
    console.log('New Arabic File:', newArFile);
    console.log('New Hebrew File:', newHeFile);
    console.log('New Deutsche File:', newDeFile);
  };

  const addEmptyBlockToAllFiles = (translationFiles, blockName) => {
    const addEmptyBlockToFile = (langFile) => {
      const newLangFile = { ...langFile };
      // Check if the block already exists
      if (!newLangFile[blockName]) {
        // Add the new empty block
        newLangFile[blockName] = {};
      } else {
        alertFaultAdded();
       }
      return newLangFile;
    };
  
    const newEnFile = addEmptyBlockToFile(translationFiles.en);
    const newArFile = addEmptyBlockToFile(translationFiles.ar);
    const newHeFile = addEmptyBlockToFile(translationFiles.he);
    const newDeFile = addEmptyBlockToFile(translationFiles.de);
  };

  // format the json data
  const data = Object.entries(translationFiles.en).map(([label, value]) => {
    return {
      label,
      rows: Object.keys(value).filter((key) => typeof value[key] === 'string'),
      children: Object.keys(value)
        .filter((key) => typeof value[key] === 'object' && value[key] !== null)
        .map((childLabel) => ({
          label: childLabel,
          rows: Object.keys(value[childLabel]).filter(
            (key) => typeof value[childLabel][key] === 'string'
          ),
        })),
    };
  });

  return {
    data,
    handleEdit,
    handleAdd,
    state,
    setState,
    openModal,
    setOpenModal,
    openCategoryModal,
    setOpenCategoryModal,
    translationFiles,
    setTranslationFiles,
    addEmptyBlockToAllFiles
  };
};

export { useTranslations };