import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton, SecondSwitch } from "@/components";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DeleteMenuIcon } from "@/widgets/quote-new/more-circle/icons/delete-menu";
import { ScheduledReport } from "@/hooks/use-scheduled-reports";

interface ScheduledReportsTableProps {
    openModal: boolean;
    onCloseModal: () => void;
    scheduledReports?: ScheduledReport[];
    onToggleActive?: (id: string, isActive: boolean) => void;
    onDelete?: (id: string) => void;
}

const ScheduledReportsTable = ({
    openModal,
    onCloseModal,
    scheduledReports = [],
    onToggleActive,
    onDelete,
}: ScheduledReportsTableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    const headers = [
        t("sales.list.reportName"),
        t("sales.list.status"),
        t("sales.list.actions"),
    ];

    const rows = (scheduledReports || []).map((report) => [
        report.reportName,
        <SecondSwitch
            key={`switch-${report.id}`}
            checked={report.isActive}
            onChange={(e) => onToggleActive?.(report.id, e.target.checked)}
        />,
        <div key={`actions-${report.id}`} style={{ ...classes.actionButtons, cursor: "pointer" }} onClick={() => {
            onDelete?.(report.id)
        }} >
            <DeleteMenuIcon />
        </div>,
    ]);

    return (
        <GoMakeModal
            openModal={openModal}
            onCloseModal={onCloseModal}
            modalTitle={t("sales.list.scheduledReports")}
            insideStyle={classes.insideStyle}
            withClose={false}
        >
            <div style={classes.mainContainer}>
                <div style={{ minHeight: "432px" }}>
                    <PrimaryTable
                        stickyHeader={true}
                        maxHeight={"400px"}
                        rows={rows}
                        headers={headers}

                        variant="OddEvenTable"
                    />
                </div>
                <div style={classes.buttonContainer}>
                    <GomakePrimaryButton
                        style={classes.closeButton}
                        onClick={onCloseModal}
                    >
                        {t("modal.close")}
                    </GomakePrimaryButton>
                </div>
            </div>
        </GoMakeModal>
    );
};

export { ScheduledReportsTable };
