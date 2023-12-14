import { useTranslation } from "react-i18next";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TranslationsWidget = () => {
    const { t } = useTranslation();
  
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Materials</Typography>
                </AccordionSummary>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography>Inputs</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography>
                             Name
                        </Typography>
                    </AccordionDetails>


                    <AccordionDetails>
                        <Typography>
                            Type
                        </Typography>
                    </AccordionDetails>

                    <AccordionDetails>
                        <Typography>
                            Size
                        </Typography>
                    </AccordionDetails>


                </Accordion>


                <AccordionDetails>
                        <Typography>
                            Add
                        </Typography>
                    </AccordionDetails>

                    <AccordionDetails>
                        <Typography>
                            Delete
                        </Typography>
                    </AccordionDetails>

            </Accordion>



      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Customers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Test
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    );
};

export { TranslationsWidget };