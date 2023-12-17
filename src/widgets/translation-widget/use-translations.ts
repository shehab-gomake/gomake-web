import { useState } from "react";

const useTranslations = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [enTranslationFile, setEnTranslationFile] = useState([]);
  const [heTranslationFile, setHeTranslationFile] = useState([]);
  const [arTranslationFile, setArTranslationFile] = useState([]);
  const [deTranslationFile, setDeTranslationFile] = useState([]);
  const [state, setState] = useState<any>({});

  const handleEdit = (enFile, arFile, heFile, deFile ,state) => {
    const updateFile = (langFile, langKey) => {
      const newLangFile = { ...langFile };
      let currentObj = newLangFile;
  
      for (const pathKey of state?.path) {
        currentObj = currentObj[pathKey];
      }
      currentObj[state?.key] = state?.[langKey];
  
      return newLangFile;
    };
  
    const newEnFile = updateFile(enFile, 'en');
    const newArFile = updateFile(arFile, 'ar');
    const newHeFile = updateFile(heFile, 'he');
    const newDeFile = updateFile(deFile, 'de');

    //must replace with updateTranslations Files func
    console.log('New English File:', newEnFile);
    console.log('New Arabic File:', newArFile);
    console.log('New Hebrew File:', newHeFile);
    console.log('New Deutsche File:', newDeFile);
  };

  // const handleAdd = (data, pathArray, key, newVal) => {
  //   const newData = { ...data };
  //     let currentObj = newData;
  //   for (const pathKey of pathArray) {
  //     if (!currentObj[pathKey]) {
  //       currentObj[pathKey] = {};
  //     }
  //     currentObj = currentObj[pathKey];
  //   }
  //   currentObj[key] = newVal;

  //   console.log(newData);
  // };
  
  const data = Object.entries(enTranslationFile).map(([label, value]) => {
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
    state,
    setState,
    openModal,
    setOpenModal,
    enTranslationFile, setEnTranslationFile,
    heTranslationFile, setHeTranslationFile,
    arTranslationFile, setArTranslationFile,
    deTranslationFile, setDeTranslationFile
  };
};

export { useTranslations };
