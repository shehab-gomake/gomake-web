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
import { ExcelButtons } from './components/excel-translations-buttons';
import {PrimaryTable} from "@/components/tables/primary-table";
import {TranslationTable} from "@/widgets/translation-widget/components/translation-table/translation-table";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";
import {
  TranslationsFileEditor
} from "@/widgets/translation-widget/components/tranlation-files-editor/tranlation-files-editor";
import {ETranslationSource} from "@/widgets/translation-widget/enums";

const TranslationsAdminWidget = () => {
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
  const avatar = 'https://i.imgur.com/MK3eW3As.jpg';
  const longArray = new Array(1000).fill(1);
  const example = {
    avatar,
    string: 'Lorem ipsum dolor sit amet',
    integer: 42,
    float: 114.514,
    bigint: 10086,
    null: null,
    undefined,
    timer: 0,
    date: new Date('Tue Sep 13 2022 14:07:44 GMT-0500 (Central Daylight Time)'),
    array: [19, 100.86, 'test', NaN, Infinity],
    nestedArray: [
      [1, 2],
      [3, 4],
    ],
    object: {
      'first-child': true,
      'second-child': false,
      'last-child': null,
    },
    longArray,
    string_number: '1234',
  };
  const onChangeText = (value) => {
    console.log("onChangeText", value);
  };
  return (
    <div style={classes.mainContainer}>
      <div style={classes.headersStyle}>
        <HeaderTitle title={t("translations.title")} />
        <AddButton onClick={onClickOpenBlockModal} label={t("translations.addNew")}></AddButton>
      </div>
      <ExcelButtons />
      <div style={{width:'100%'}}>
        <PrimaryTabsComponent 
            tabs={[{title:'table view',component:<TranslationTable translationSource={ETranslationSource.WEB}/>},{title:'json view',component:<TranslationsFileEditor/>}]}
        
        />
        
      </div>
      {/* <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />*/}
      <TranslationModal state={state} setState={setState} translationFiles={translationFiles} />
      <AddBlockModal translationFiles={translationFiles} />
     
    </div>
  );
};

export { TranslationsAdminWidget };