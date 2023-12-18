import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateTranslationFilesApi } from "@/services/api-service/aws-s3/update-translations-file";
import { useState } from "react";

const useTranslations = () => {
  const { alertFaultAdded, alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [state, setState] = useState<any>({});
  const { callApi } = useGomakeAxios();
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

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    //must replace with updateTranslations func
    onUpdateTranslationFiles(arrayFiles);
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
      const newValue = state?.[langKey];

      if (newValue !== undefined && newValue !== null && newValue !== '') {
        currentObj[newKey] = newValue;
      }

      return newLangFile;
    };

    const newEnFile = updateFile(translationFiles.en, 'en');
    const newArFile = updateFile(translationFiles.ar, 'ar');
    const newHeFile = updateFile(translationFiles.he, 'he');
    const newDeFile = updateFile(translationFiles.de, 'de');

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    onUpdateTranslationFiles(arrayFiles);

  };

  const addEmptyBlockToAllFiles = (translationFiles, blockName) => {
    const addEmptyBlockToFile = (langFile) => {
      const newLangFile = { ...langFile };
      // Check if the block already exists
      if (!newLangFile[blockName]) {
        // Add the new empty block
        newLangFile[blockName] = [];
      } else {
        alertFaultAdded();
      }
      return newLangFile;
    };

    const newEnFile = addEmptyBlockToFile(translationFiles.en);
    const newArFile = addEmptyBlockToFile(translationFiles.ar);
    const newHeFile = addEmptyBlockToFile(translationFiles.he);
    const newDeFile = addEmptyBlockToFile(translationFiles.de);

    const arrayFiles = [
      {
        key: "en",
        file: newEnFile
      },
      {
        key: "ar",
        file: newArFile
      },
      {
        key: "he",
        file: newHeFile
      },
      {
        key: "de",
        file: newDeFile
      },
    ];

    //must replace with updateTranslations func
    onUpdateTranslationFiles(arrayFiles);
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



  const onUpdateTranslationFiles = async (updatedTranslationFiles) => {
    const callBack = (data) => {
      if (data.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    }
    await updateTranslationFilesApi(callApi, callBack, updatedTranslationFiles)
  }

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