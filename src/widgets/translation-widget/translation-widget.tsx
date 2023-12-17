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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [translationFile, setTranslationFile] = useState([]);
  const [state, setState] = useState<any>({});
  const { classes } = useStyle()

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            const data = await fetchS3JsonTranslation("en.json")
            setTranslationFile(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };
    fetchTranslations();
}, []);


const data = Object.entries(translationFile).map(([label, value]) => {
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


  ///////////////////////////////////////////////////////


  const jsonData = {
    settings: {
      inputs1: {
        name1: "Name 1",
        type1: "Type 1",
        size1: "Size 1"
      },
      save: 'Save',
    },
    customers: {
      firstName: 'First name',
      lastName: "Last name"
    },
    suppliers: {
      buttons: {
        addSupplier: 'Add Supplier',
        editSupplier: 'Edit Supplier',
        deleteSupplier: 'Delete Supplier',
      },
      title: 'Suppliers',
      subTitle: "Supplier"
    },
  };
  // const handleEdit = (data, path, key, newVal) => {
  //   const newData = { ...data };
  //     const pathKeys = path.split('/');
  //     let currentObj = newData;
  //   for (const pathKey of pathKeys) {
  //     currentObj = currentObj[pathKey];
  //   }
  
  //   currentObj[key] = newVal;
  
  //   console.log( newData);
  // };
  
  // Example usage


  const handleEdit = (data, pathArray, key, newVal) => {
    const newData = { ...data };
  
    let currentObj = newData;
    for (const pathKey of pathArray) {
      currentObj = currentObj[pathKey];
    }
  
    currentObj[key] = newVal;
  
    console.log( newData);
  };

  return (
    <div style={classes.mainContainer}>
      <div style={classes.headersStyle}>
        <HeaderTitle title={"Translations"} />
        <AddButton onClick={() =>null } label='add new'></AddButton>
      </div>
      <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
      <TranslationModal openModal={openModal} setOpenModal={setOpenModal} label={"Hello"} state={state} setState={setState} handleEdit={handleEdit} data={translationFile} />
    </div>
  );
};

export { TranslationsWidget };