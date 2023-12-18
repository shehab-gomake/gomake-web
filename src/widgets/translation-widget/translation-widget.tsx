import React, { useEffect } from 'react';
import { TranslationModal } from './components/translation-modals/translation -modal';
import { useStyle } from './style';
import { AddButton } from '@/components/button/add-button';
import { HeaderTitle } from "@/widgets";
import { fetchS3JsonTranslation } from '@/utils/S3Translation';
import { useTranslations } from './use-translations';
import { NestedAccordion } from './components/nested-accordion';
import { AddBlockModal } from './components/translation-modals/add-block-modal';

const TranslationsWidget = () => {
  const { classes } = useStyle()
  const {
    data,
    state,
    setState,
    openModal,
    setOpenModal,
    openCategoryModal,
    setOpenCategoryModal,
    translationFiles,
    setTranslationFiles } = useTranslations();

  useEffect(() => {
    const fetchTranslationFiles = async () => {
      try {
        const english = await fetchS3JsonTranslation("en.json");
        const hebrew = await fetchS3JsonTranslation("he.json");
        const arabic = await fetchS3JsonTranslation("ar.json");
        const deutsche = await fetchS3JsonTranslation("de.json");

        setTranslationFiles({
          en: english,
          he: hebrew,
          ar: arabic,
          de: deutsche,
        });
      } catch (error) {
        console.error('Error fetching languages files:', error);
      }
    };
    fetchTranslationFiles();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headersStyle}>
        <HeaderTitle title={"Translations"} />
        <AddButton onClick={() => setOpenCategoryModal(true)} label='add new'></AddButton>
      </div>
      <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
      <TranslationModal openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} translationFiles={translationFiles} />
      <AddBlockModal openModal={openCategoryModal} setOpenModal={setOpenCategoryModal} state={state} translationFiles={translationFiles}/>
    </div>
  );
};

export { TranslationsWidget };