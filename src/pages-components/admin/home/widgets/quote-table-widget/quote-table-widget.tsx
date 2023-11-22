import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuoteTableWidget } from "./use-quote-table-widget";
import { SecondaryButton } from "@/components/button/secondary-button";
import { Stack } from "@mui/material";

const QuoteTableWidget = ({ isAdmin = true }) => {
    const { classes } = useStyle();
    const { tableHeaders, tableRows } = useQuoteTableWidget();


    return (

        <div style={classes.mainContainer}>
            <Stack direction={"row"} justifyContent={'space-between'} width={'100%'}>
                <div style={classes.buttonsContainerStyle} >
                    <SecondaryButton variant="contained" style={classes.buttonStyle}>Quotes</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Orders</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Items</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Delivery</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Invoice</SecondaryButton>
                    <SecondaryButton variant="contained" style={classes.buttonSecondStyle}>Recipt</SecondaryButton>
                </div>
                <SecondaryButton variant="contained" style={classes.addNewStyle}>Add new</SecondaryButton>
            </Stack>
            <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={false}
                rows={tableRows}
                headers={tableHeaders}
            />
        </div>
    );
};

export { QuoteTableWidget };
