import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Stack } from '@mui/material';
import { PlusIcon } from '@/icons';
import { useStyle } from './style';

const NestedAccordion = ({ data, openModal, setOpenModal, state, setState, path = [] }) => {

    const { classes } = useStyle()

    if (!data || data.length === 0) {
        return null;
    }

    const handleClickAdd = (event, currentPath) => {
        event.stopPropagation();
        setOpenModal(true);
        setState({ path: currentPath , isEdit: false });
    }

    const handleClickEdit = (row, currentPath) => {
        setOpenModal(true);
        setState({key: row, path: currentPath , isEdit: true })
    }

    return (
        <>
            {data.map((item, index) => {
                const currentPath = [...path, item.label];
                return (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel-${index}-content`}
                            id={`panel-${index}-header`}
                        >
                            <Typography>
                                <IconButton onClick={(event) => handleClickAdd(event, currentPath)}>
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
                                    <Stack style={classes.accordionRowStyle}>
                                        <Typography>{row}</Typography>
                                        <IconButton onClick={() => handleClickEdit(row, currentPath)}>
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

export { NestedAccordion };