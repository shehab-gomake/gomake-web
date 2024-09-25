import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Modal, Tooltip, Tabs, Tab, Box, styled, Stack } from "@mui/material";
import { useStyle } from "./style";
import { CloseIcon } from "./icons/close-icon";
import { NoDataComponent } from "./no-data-component";

const StyledTab = styled(Tab)(() => ({
    display: 'flex',
    height: '44px',
    padding: 'var(--spacing-md, 8px) var(--spacing-lg, 12px)',
    margin: "1px",
    alignItems: 'center',
    gap: 'var(--spacing-md, 8px)',
    alignSelf: 'stretch',
    color: 'var(--colors-text-text-quaternary-500, #667085)',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '24px',
    textTransform: 'none',
    '&.Mui-selected': {
        borderRadius: 'var(--radius-sm, 6px)',
        background: '#FFFFFF',
        boxShadow: '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        color: '#000000',
    },
}));

const SecondaryTabs = styled(Tabs)(() => {
    return {
        '& .MuiTabs-indicator': {
            display: 'none',
        },
    }
});

interface IPaymentMethodsDetailsModalProps {
    openModal: boolean;
    modalTitle: string;
    handleModalClose: () => void;
    isShowFirstTabContent: boolean;
    isShowSecondTabContent: boolean;
    isShowThirdTabContent: boolean;
    firstTabContent: any;
    secondTabContent: any;
    thirdTabContent: any;
}

const PaymentMethodsDetailsModal = ({
    openModal,
    handleModalClose,
    modalTitle,
    isShowFirstTabContent,
    firstTabContent,
    isShowSecondTabContent,
    secondTabContent,
    isShowThirdTabContent,
    thirdTabContent
}: IPaymentMethodsDetailsModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    const getDefaultTab = () => {
        if (isShowFirstTabContent) return 0;
        if (isShowSecondTabContent) return 1;
        if (isShowThirdTabContent) return 2;
        return 0;
    };
    const [activeTab, setActiveTab] = useState(getDefaultTab);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number,) => {
        setActiveTab(newValue);
    };

    const handleCloseModal = () => {
        if (isShowFirstTabContent) {
            setActiveTab(0);
        } else if (isShowSecondTabContent) {
            setActiveTab(1);
        } else if (isShowThirdTabContent) {
            setActiveTab(2);
        } else {
            setActiveTab(0);
        }
        handleModalClose();
    };

    const TabContent = () => {
        switch (activeTab) {
            case 0:
                return isShowFirstTabContent ? firstTabContent() :
                    <NoDataComponent subNoDataText={t("payment.noTransference")} />;
            case 1:
                return isShowSecondTabContent ? secondTabContent() :
                    <NoDataComponent subNoDataText={t("payment.noChecks")} />;
            case 2:
                return isShowThirdTabContent ? thirdTabContent() :
                    <NoDataComponent subNoDataText={t("payment.noCredit")} />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <Modal
            disableEnforceFocus
            open={openModal}
            onClose={handleCloseModal}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={classes.container}>
                <div style={classes.headerContainer}>
                    <div style={classes.titleModalStyle}>{modalTitle}</div>
                    <Tooltip title={t("modal.close")}>
                        <IconButton onClick={handleCloseModal} >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div style={{ display: "flex", gap: "10px", width: "100%", overflowX: "scroll" }}>
                    <SecondaryTabs
                        orientation="vertical"
                        variant="scrollable"
                        value={activeTab}
                        onChange={handleTabChange}
                        style={classes.tabsContainer}
                    >
                        <StyledTab label={t("payment.transfer")} />
                        <StyledTab label={t("payment.checks")} />
                        <StyledTab label={t("payment.creditCard")} />
                    </SecondaryTabs>
                    <Box style={classes.tabContent}>
                        <TabContent />
                    </Box>
                </div>
            </div>
        </Modal>
    );
};

export { PaymentMethodsDetailsModal };
