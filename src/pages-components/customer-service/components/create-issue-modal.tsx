import React, { useEffect, useState } from "react";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useStyle } from "../style";
import { CreateIssueModalProps, TicketTypeList } from "../interface";
import { useTranslation } from "react-i18next";

import { JiraImageUpload } from "./jira-Image-Upload";

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  openModal,
  ticketTypeList,
  onClickClosModal,
  createIssue,
  setTicketState,
  ticketState,
  setFileBase64,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeModal
      insideStyle={classes.insideStyle}
      openModal={openModal}
      onClose={onClickClosModal}
      modalTitle={t("customerService.addNewTicket")}
    >
      <div style={classes.mainModalContainer}>
        <GoMakeAutoComplate
          options={ticketTypeList}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.chooseTheTicketType")}
          onChange={(e, val) => setTicketState({ ...ticketState, ticketType: val })}
          value={ticketState?.ticketType}
        />

        <JiraImageUpload onUpload={true} onFileSelect={setFileBase64} />

        <GomakeTextInput
          onChange={(e) => setTicketState({ ...ticketState, title: e.target.value })}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.typeTheTicketTitle")}
          value={ticketState?.title}
        />
        <GomakeTextInput
          onChange={(e) => setTicketState({ ...ticketState, description: e.target.value })}
          style={classes.multiTextInput}
          placeholder={t("customerService.typeTheTicketDescription")}
          value={ticketState?.description}
          multiline
        />

        <GomakePrimaryButton style={classes.btnContainer} onClick={createIssue}>
          {t("customerService.addTicket")}
        </GomakePrimaryButton>
      </div>
    </GoMakeModal>
  );
};

export { CreateIssueModal };
