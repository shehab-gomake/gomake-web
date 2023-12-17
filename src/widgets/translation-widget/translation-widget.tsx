import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';
import { TranslationModal } from './components/edit-key/edit-key-modal';
import { HeaderTitleWithSearch } from '../header-title-with-search';
import { useStyle } from './style';
import { PlusIcon } from '@/icons';
import { AddButton } from '@/components/button/add-button';
import { HeaderTitle } from "@/widgets";
import { fetchS3JsonTranslation } from '@/utils/S3Translation';
import { useTranslations } from './use-translations';

const NestedAccordion = ({ data, setOpenModal, openModal, state, setState, path = [] }) => {

  if (!data || data.length === 0) {
    return null;
  }

  const handleClick = (event, currentPath) => {
    event.stopPropagation();
    setOpenModal(true);
    setState({ ...state, path: currentPath });
  }

  return (
    <>
      {data.map((item, index) => {
        const currentPath = [...path, item.label];
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${index}-content`}
              id={`panel-${index}-header`}
            >
              <Typography>
                <IconButton onClick={(event) => handleClick(event, currentPath)}>
                  <PlusIcon />
                </IconButton>
                {item.label}
                </Typography>
            </AccordionSummary>
            {item.children && item.children.length > 0 && (
              <AccordionDetails>
                <NestedAccordion
                  data={item.children}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  state={state}
                  setState={setState}
                  path={currentPath}
                />
              </AccordionDetails>
            )}
            {item.rows &&
              item.rows.map((row, rowIndex) => (
                <AccordionDetails key={rowIndex}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography>{row}</Typography>
                    <IconButton onClick={() => { setOpenModal(true); setState({ ...state, key: row, path: currentPath }) }}>
                      <EditIcon />
                    </IconButton>
                  </Stack>
                </AccordionDetails>
              ))}
          </Accordion>
        );
      })}
    </>
  );
};

const TranslationsWidget = () => {

  const { classes } = useStyle()
  const {data,
    handleEdit,
    state,
    setState,
    openModal,
    setOpenModal,
    enTranslationFile, setEnTranslationFile,
    heTranslationFile, setHeTranslationFile,
    arTranslationFile, setArTranslationFile,
    deTranslationFile, setDeTranslationFile} = useTranslations();
    
  useEffect(() => {
    const fetchTranslationFiles = async () => {
        try {
            const english = await fetchS3JsonTranslation("en.json")
            setEnTranslationFile(english);
            const hebrew = await fetchS3JsonTranslation("he.json")
            setHeTranslationFile(hebrew);
            const arabic = await fetchS3JsonTranslation("ar.json")
            setArTranslationFile(arabic);
            const deutsche = await fetchS3JsonTranslation("de.json")
            setDeTranslationFile(deutsche);
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
        <AddButton onClick={() =>null } label='add new'></AddButton>
      </div>
      <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
      <TranslationModal openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState}  />
    </div>
  );
};

export { TranslationsWidget };