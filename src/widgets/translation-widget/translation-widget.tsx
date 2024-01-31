import React from 'react';
import {TranslationModal} from './components/translation-modals/translation -modal';
import {useStyle} from './style';
import {HeaderTitle} from "@/widgets";
import {AddBlockModal} from './components/translation-modals/add-block-modal';
import {useTranslation} from 'react-i18next';
import {useTranslations} from './use-translations';
import {TranslationTable} from "@/widgets/translation-widget/components/translation-table/translation-table";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {ETranslationSource} from "@/widgets/translation-widget/enums";

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
    setTranslationFiles
  } = useTranslations();

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headersStyle}>
        <HeaderTitle title={t("translations.title")} />
      </div>
      <div style={{width:'100%'}}>
        <PrimaryTabsComponent 
            tabs={[{title:'Products',component:<TranslationTable translationSource={ETranslationSource.PRODUCTS}/>},{title:'Materials',component:<TranslationTable translationSource={ETranslationSource.MATERIALS}/>}]}
        
        />
        
      </div>
      {/* <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />*/}
      <TranslationModal state={state} setState={setState} translationFiles={translationFiles} />
      <AddBlockModal translationFiles={translationFiles} />
     
    </div>
  );
};

export { TranslationsWidget };