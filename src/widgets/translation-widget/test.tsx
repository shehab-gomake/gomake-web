import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';
import { GoMakeModal } from '@/components';
import { TranslationModal } from './components/edit-key/edit-key-modal';

const NestedAccordion = ({ data , setOpenModal , openModal , state , setState}) => {

    if (!data || data.length === 0) {
        return null;
    }
    return (
        <>
            {data.map((item, index) => (
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
                            <NestedAccordion data={item.children} openModal={openModal} setOpenModal={setOpenModal} state={state} setState={setState} />
                        </AccordionDetails>
                    )}
                    {item.rows &&
                        item.rows.map((row, rowIndex) => (
                            <AccordionDetails key={rowIndex}>
                                <Stack direction={"row"} justifyContent={"space-between"}>
                                    <Typography>{row}</Typography>
                                    <IconButton>
                                        <EditIcon onClick={() => {setOpenModal(true);  setState({ ...state, key: row }) }} />
                                    </IconButton>
                                </Stack>
                            </AccordionDetails>
                        ))}
                </Accordion>
            ))}
                
        </>
    );
};

const TranslationsWidget = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [state, setState] = useState<any>({});


    const jsonData = {
        settings: {
          settings: 'Settings',
          profile: 'Profile',
        },
        customers: {
          buttons: {
            addCustomer: 'Add Customer',
          },
          modal: {
            addTitle: 'Add new customer',
          },
          title: 'Customers',
          // ... other customer properties
        },
        suppliers: {
          buttons: {
            addSupplier: 'Add Supplier',
            // ... other buttons
          },
          title: 'Suppliers',
          // ... other supplier properties
        },
        // ... other sections like materials, etc.
      };
    
      // Convert JSON data into the format used by the NestedAccordion component
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

    // const data = [
    //     {
    //         label: 'Materials',
    //         children: [
    //             {
    //                 label: 'Inputs',
    //                 rows: ['Name', 'Type', 'Size'],

    //             },
    //         ],
    //         rows: ['Save'],
    //     },
    //     {
    //         label: 'Customers',
    //         rows: ['First Name', 'Last Name'],
    //     },
    //     {
    //         label: 'Suppliers',
    //         children: [
    //             {
    //                 label: 'Contacts',
    //                 rows: ['Phone', 'Address', 'Jop'],
    //             },
    //         ],
    //         rows: ['First Name', 'Last Name'],
    //     },

    // ];

    return (
    <div>
        <NestedAccordion data={data} openModal={openModal} setOpenModal={setOpenModal}  state={state} setState={setState}/>
        <TranslationModal openModal={openModal} setOpenModal={setOpenModal} label={"Hello"} state={state} setState={setState}/>
    </div>);
};

export { TranslationsWidget };