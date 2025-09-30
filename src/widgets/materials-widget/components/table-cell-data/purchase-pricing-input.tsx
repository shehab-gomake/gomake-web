import React from "react";
import { Box, Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FONT_FAMILY } from "@/utils/font-family";

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
        <Button
            onClick={toggleExpanded}
            startIcon={
                isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
            }
            sx={{
                backgroundColor: "buttonColor",
                color: '#000000',
                height: "35px",
                minWidth: "90px",
                padding: "6px 12px",
                width: "fit-content",
                border: "1px solid #ccc",
                margin: 0,
                "&:hover": {
                    opacity: 0.7,
                    backgroundColor: "transparent",
                    color: '#000000',
                },

            }}
        >
            <div style={{
                ...FONT_FAMILY.Lexend(500, 14),
                display: 'flex',
                alignItems: 'center',
            }}>
                {isExpanded ? "Hide" : "Open"}
            </div>

        </Button>
    );
};

export { PurchasePricingInput };
