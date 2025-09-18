import React from "react";
import { Box, Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IPurchasePricingInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

const PurchasePricingInput = ({ value, isAdmin, id }: IPurchasePricingInputProps) => {
    const { secondColor } = useGomakeTheme();
    const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);
    const isExpanded = openChildTable.rowId === id && openChildTable.tableType === 'purchasePricing';

    const toggleExpanded = () => {
        if (isExpanded) {
            setOpenChildTable({ rowId: '', tableType: null });
        } else {
            setOpenChildTable({ rowId: id, tableType: 'purchasePricing' });
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Button
                variant="contained"
                color="primary"
                onClick={toggleExpanded}
                size="small"
                sx={{
                    backgroundColor: secondColor(500),
                    minWidth: '60px',
                    width: '60px',
                    '&:hover': {
                        backgroundColor: secondColor(600),
                    }
                }}
            >
                {isExpanded ? "Hide" : "Open"}
            </Button>
        </Box>
    );
};

export { PurchasePricingInput };
