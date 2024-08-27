import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface GoMakeDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    buttonText?: string;
}

const GoMakeDialog: React.FC<GoMakeDialogProps> = ({
    open,
    onClose,
    title,
    description,
    buttonText = "modal.ok",
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="go-make-dialog-title"
            aria-describedby="go-make-dialog-description"
        >
            <DialogTitle id="go-make-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="go-make-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>
                    {t(buttonText)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { GoMakeDialog }
