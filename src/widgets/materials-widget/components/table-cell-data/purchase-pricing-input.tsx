import React from "react";
import { Box, Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GomakePrimaryButton } from "@/components/button/button";

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
            <GomakePrimaryButton
                onClick={toggleExpanded}
                style={{
                    minWidth: '60px',
                    width: 'fit-content',
                    height: '36px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: "transparent",
                    color: "#000",
                    border: `1px solid #ccc`,
                    '&:hover': {
                        backgroundColor: secondColor(600),
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.2s ease-in-out'
                }}

            >
                {isExpanded ? "Hide" : "Open"}
            </GomakePrimaryButton>
        </Box>
    );
};

export { PurchasePricingInput };
