import React, { useEffect, useState } from "react";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { FormInput } from "@/components/form-inputs/form-input";
import { useStyle } from "../style";
import { CreateIssueModalProps, TicketTypeList } from "../interface";
import { useTranslation } from "react-i18next";
import { GoMakeFileFiled } from "@/components/file-filed/file-filed";
import { IInput } from "@/components/form-inputs/interfaces";

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  openModal,
  ticketType,
  ticketTypeList,
  title,
  description,
  setDescription,
  setTitle,
  onClickClosModal,
  createIssue,
  onChangeInputs,
  setTicketState,
  ticketState,
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
          // onChange={(e) => setTicketState(ticketType, e.target.value)}
          onChange={(e, val) => setTicketState({ ...ticketState, ticketType: val })}
          value={ticketState?.ticketType}
        />
        <GomakeTextInput
          onChange={(e) => setTicketState({ ...ticketState, title: e.target.value })}
          // onChange={(e) => setTitle(e.target.value)}
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
