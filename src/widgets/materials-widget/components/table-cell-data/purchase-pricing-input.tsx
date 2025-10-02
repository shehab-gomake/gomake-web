import React from "react";
import { Box, Button } from "@mui/material";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

interface IPurchasePricingInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

const PurchasePricingInput = ({ value, isAdmin, id }: IPurchasePricingInputProps) => {
    const { secondColor } = useGomakeTheme();
    const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);
    const isExpanded = openChildTable.rowId === id && openChildTable.tableType === 'purchasePricing';
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const toggleExpanded = () => {
        if (isExpanded) {
            setOpenChildTable({ rowId: '', tableType: null });
        } else {
            setOpenChildTable({ rowId: id, tableType: 'purchasePricing' });
        }
    };

    return (


        <Box
            onClick={toggleExpanded}
            sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                color: '#000000',
                height: "35px",
                minWidth: "90px",
                padding: "0px 4px",
                border: "1px solid #ccc",
                margin: 0,
                width: "100%",
                cursor: "pointer",
                "&:hover": {
                    opacity: 0.7,
                    backgroundColor: "transparent",
                    color: '#000000',
                },

            }}
        >

            <>
                {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </>
            <div style={{
                ...FONT_FAMILY.Lexend(500, 14),
            }}>
                {isExpanded ? t("sales.quote.hide") : t("sales.quote.open")}
            </div>

        </Box>
    );
};

export { PurchasePricingInput };
