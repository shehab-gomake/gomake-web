import React from "react";
import { Box, Typography } from "@mui/material";

interface ISuppliersInputProps {
    value?: string;
    isAdmin: boolean;
}

const SuppliersInput = ({ value, isAdmin }: ISuppliersInputProps) => {
    return (
        <Box sx={{
            minWidth: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {value || "—"}
            </Typography>
        </Box>
    );
};

export { SuppliersInput };
