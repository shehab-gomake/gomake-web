import Stack from "@mui/material/Stack";
import { ClientErrorCode } from "@/pages/customers/enums";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import styled from "styled-components";
import { ErrorMessage } from "../../use-customers";
import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { Box, Typography } from "@mui/material";

interface IClientUploadExcelErrorsModalProps {
  openErrorsModal: boolean;
  handleErrorsModalClose: () => void;
  errorMessages: ErrorMessage[];
}
const ClientUploadExcelErrorsModal = ({
  openErrorsModal,
  handleErrorsModalClose,
  errorMessages,
}: IClientUploadExcelErrorsModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const ScrollableDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: auto;
    gap: 20px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    &::-webkit-scrollbar-thumb {
      background: #cccdcf;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #b0b0b0;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
  `;

  return (
    <GoMakeModal
      modalTitle={t("importData.errorsMessages")}
      insideStyle={classes.insideModalStyle}
      openModal={openErrorsModal}
      onClose={handleErrorsModalClose}
      modalTitleStyle={classes.modalTitle}
      withRoundedCloseIcon={false}
    >
      <Stack gap={"20px"}>
        <ScrollableDiv>
          {errorMessages.length > 0 ? (
            errorMessages.map(({ lineNumber, errorCode }, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  width: "95%",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: "#333" }}
                >{`${t("uploadClientError.line")}: ${lineNumber}`}</Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {t(`uploadClientError.${ClientErrorCode[errorCode]}`)}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#888" }}
            >
              {t("importData.noErrors")}
            </Typography>
          )}
        </ScrollableDiv>
        <GomakePrimaryButton
          style={classes.btnStyle}
          onClick={handleErrorsModalClose}
        >
          {t("modal.ok")}
        </GomakePrimaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { ClientUploadExcelErrorsModal };
