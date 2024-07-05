import React from "react";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useStyle } from "../style";
import { CreateIssueModalProps, TicketTypeList } from "../interface";
import { useTranslation } from "react-i18next";

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  openModal,
  ticketType,
  ticketTypeList,
  title,
  description,
  setDescription,
  setTitle,
  setTicketType,
  onClickClosModal,
  createIssue,
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
          onChange={(e: any, item: TicketTypeList) => setTicketType(item)}
          value={ticketType}
        />
        <GomakeTextInput
          onChange={(e) => setTitle(e.target.value)}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.typeTheTicketTitle")}
          value={title}
        />
        <GomakeTextInput
          onChange={(e) => setDescription(e.target.value)}
          style={classes.multiTextInput}
          placeholder={t("customerService.typeTheTicketDescription")}
          value={description}
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
