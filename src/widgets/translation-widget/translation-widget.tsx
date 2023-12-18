import React, { useEffect } from 'react';
import { TranslationModal } from './components/translation-modals/translation -modal';
import { useStyle } from './style';
import { AddButton } from '@/components/button/add-button';
import { HeaderTitle } from "@/widgets";
import { fetchS3JsonTranslation } from '@/utils/S3Translation';
import { NestedAccordion } from './components/nested-accordion';
import { AddBlockModal } from './components/translation-modals/add-block-modal';
import { useTranslation } from 'react-i18next';
import { useTranslations } from './use-translations';

const TranslationsWidget = () => {
  const { classes } = useStyle()
  const { t } = useTranslation();
  const {
    data,
    state,
    setState,
    openModal,
    setOpenModal,
    onClickOpenBlockModal,
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
        <HeaderTitle title={t("translations.title")} />
        <AddButton onClick={onClickOpenBlockModal} label={t("translations.addNew")}></AddButton>
      </div>
      <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
      <TranslationModal  state={state} setState={setState} translationFiles={translationFiles} />
      <AddBlockModal translationFiles={translationFiles} />
    </div>
  );
};

export { TranslationsWidget };