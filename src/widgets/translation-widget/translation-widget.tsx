import React, { useState } from 'react';
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


const NestedAccordion = ({ data, setOpenModal, openModal, state, setState, path = [] }) => {

  if (!data || data.length === 0) {
    return null;
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
              <Typography>{item.label}</Typography>
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
                    <IconButton>
                      <EditIcon onClick={() => { setOpenModal(true); setState({ ...state, key: row, path: currentPath }) }} />
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
  const [state, setState] = useState<any>({});
  const { classes } = useStyle()


  const jsonData = {
    settings: {
      settings: 'Settings',
      profile: 'Profile',
    },
    customers: {
      buttons: {
        modalEdit: {
          editTitle: 'Add new customer',
        },
        addCustomer: 'Add Customer',
      },
      modal: {
        addTitle: 'Add new customer',
      },
      title: 'Customers',
    },
    suppliers: {
      buttons: {
        addSupplier: 'Add Supplier',
      },
      title: 'Suppliers',
    },
  };

  // not so good (jsonData)
  const data = Object.entries(jsonData).map(([label, value]) => {
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


  // work well
  const dataNew = [
    {
      label: 'Materials',
      children: [
        {
          label: 'Inputs1',
          children: [
            {
              label: 'Inputs2',
              rows: ['Name', 'Type', 'Size'],

            },
          ],
          rows: ['Name', 'Type', 'Size'],

        },
      ],
      rows: ['Save'],
    },
    {
      label: 'Customers',
      rows: ['First Name', 'Last Name'],
    },
    {
      label: 'Suppliers',
      children: [
        {
          label: 'Contacts',
          rows: ['Phone', 'Address', 'Jop'],
        },
      ],
      rows: ['First Name', 'Last Name'],
    },
  ];

  return (
    <div style={classes.mainContainer}>
      <HeaderTitleWithSearch title={"Translations"} onChange={() => null} />
      <NestedAccordion data={dataNew} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
      <TranslationModal openModal={openModal} setOpenModal={setOpenModal} label={"Hello"} state={state} setState={setState} />
    </div>);
};

export { TranslationsWidget };