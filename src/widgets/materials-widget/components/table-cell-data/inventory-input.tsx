import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { openChildTableState } from "../../state";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IInventoryInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

const InventoryInput = ({ value, isAdmin, id }: IInventoryInputProps) => {
    const { t } = useTranslation();
    const { secondColor } = useGomakeTheme();
    const [openChildTable, setOpenChildTable] = useRecoilState(openChildTableState);
    const isExpanded = openChildTable.rowId === id && openChildTable.tableType === 'inventory';

    const toggleExpanded = () => {
        if (isExpanded) {
            setOpenChildTable({ rowId: '', tableType: null });
        } else {
            setOpenChildTable({ rowId: id, tableType: 'inventory' });
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

export { InventoryInput };
