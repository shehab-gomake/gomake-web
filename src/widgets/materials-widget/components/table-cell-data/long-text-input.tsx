import React, { useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";

interface ILongTextInputProps {
    value?: string;
    isAdmin: boolean;
    id: string;
}

const LongTextInput = ({ value, isAdmin, id }: ILongTextInputProps) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const displayText = value || '';
    const truncatedText = displayText.length > 30
        ? displayText.substring(0, 30) + '...'
        : displayText;

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
                width: '100%'
            }}>
                <Box
                    onClick={handleOpenModal}
                    sx={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: displayText.length > 30 ? 'pointer' : 'default',
                        backgroundColor: displayText.length > 30 ? '#f5f5f5' : 'transparent',
                        border: displayText.length > 30 ? '1px solid #e0e0e0' : 'none',
                        minHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: displayText.length > 30 ? '#1976d2' : '#666',
                        textAlign: 'center',
                        '&:hover': displayText.length > 30 ? {
                            backgroundColor: '#e3f2fd',
                            borderColor: '#1976d2'
                        } : {},
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    {truncatedText || '—'}
                </Box>
            </Box>

            {/* Full Text Modal */}
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Full Text</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, p: 2, backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '14px',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}
                        >
                            {displayText || 'No text content'}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <GomakePrimaryButton
                        onClick={handleCloseModal}
                        style={{ width: 'auto', padding: '8px 16px' }}
                    >
                        Close
                    </GomakePrimaryButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { LongTextInput };
