import React, { useState, useMemo } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface ILongTextInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

const LongTextInput = ({ value, isAdmin, id }: ILongTextInputProps) => {
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Parse supplier names from comma-separated string
    const supplierNames = useMemo(() => {
        if (!value || !value.trim()) return [];
        return value.split(',').map(name => name.trim()).filter(name => name.length > 0);
    }, [value]);
    const firstSupplier = supplierNames[0] || '';
    const remainingCount = supplierNames.length - 1;

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: '40px'
            }}>
                {supplierNames.length === 0 ? (
                    <Typography sx={{ fontSize: '14px', color: '#666' }}>—</Typography>
                ) : supplierNames.length === 1 ? (
                    <Typography sx={{
                        fontSize: '14px',
                        color: '#333',
                        textAlign: 'center',
                        wordBreak: 'break-word'
                    }}>
                        {firstSupplier}
                    </Typography>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        width: '100%'
                    }}>
                        <Typography sx={{
                            fontSize: '14px',
                            color: '#333',
                            textAlign: 'center',
                            wordBreak: 'break-word'
                        }}>
                            {firstSupplier}
                        </Typography>
                        <Chip
                            label={`+${remainingCount} more`}
                            size="small"
                            onClick={handleOpenModal}
                            sx={{
                                height: '20px',
                                fontSize: '11px',
                                backgroundColor: primaryColor(100),
                                color: primaryColor(700),
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: primaryColor(200),
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Suppliers List Modal */}
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#333',
                    borderBottom: '1px solid #e0e0e0',
                    pb: 2
                }}>
                    Suppliers List ({supplierNames.length})
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <List sx={{
                        maxHeight: '400px',
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f1f1',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#c1c1c1',
                            borderRadius: '3px',
                            '&:hover': {
                                backgroundColor: '#a8a8a8',
                            },
                        },
                    }}>
                        {supplierNames.map((supplier, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    borderBottom: index < supplierNames.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: primaryColor(400),
                                                flexShrink: 0
                                            }} />
                                            <Typography sx={{
                                                fontSize: '14px',
                                                color: '#333',
                                                wordBreak: 'break-word'
                                            }}>
                                                {supplier}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
                    <GomakePrimaryButton
                        onClick={handleCloseModal}
                        style={{
                            width: 'auto',
                            backgroundColor: primaryColor(500),
                            color: '#fff',
                            height: '40px'
                        }}
                    >
                        {t('modal.close')}
                    </GomakePrimaryButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { LongTextInput };
