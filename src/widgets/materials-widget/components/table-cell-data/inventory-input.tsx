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
                    backgroundColor: isExpanded ? secondColor(600) : secondColor(500),
                    minWidth: '70px',
                    width: 'auto',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                        backgroundColor: secondColor(600),
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                {value || '0'}
                <Box
                    component="span"
                    sx={{
                        fontSize: '10px',
                        marginLeft: '4px',
                        opacity: 0.8
                    }}
                >
                    {isExpanded ? '▼' : '▶'}
                </Box>
            </Button>
        </Box>
    );
};

export { InventoryInput };
