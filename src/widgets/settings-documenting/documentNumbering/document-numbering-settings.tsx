import { NumberingTable } from "./components/numbering-table/numbering-table";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { Stack, Tooltip } from "@mui/material";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useDocumentNumbers } from "./use-documents-numbers";
import {
  editDocumentInputs,
  editDocumentInputs1,
} from "./inputs/edit-modal-inputs";
import { SecondaryButton } from "@/components/button/secondary-button";
const DocumentNumbering = () => {
  const { classes } = useStyle();
  const {
    openModal,
    setOpenModal,
    document,
    setDocument,
    onUpdateDocument,
    handleOnClose,
    setShowTooltip,
    showTooltip,
  } = useDocumentNumbers();
  const { t } = useTranslation();

  const onChangeInputs = (key, value) => {
    if (key === "value" && value <= document.nextValue) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
    setDocument({ ...document, [key]: value });
  };

  return (
    <div style={classes.container}>
      <div style={classes.header}>
        <NumberingTable />
        <GoMakeModal
          insideStyle={classes.insideStyle}
          headerPadding={15}
          openModal={openModal}
          onClose={handleOnClose}
          modalTitle={
            t("documentingSettings.editDefinition") +
            " - " +
            document?.documentName
          }
        >
          <Stack direction={"column"} gap={"20px"} padding={3}>
            <Stack direction={"row"} gap={"19px"}>
              {editDocumentInputs(document).map((item) => (
                <div>
                  <FormInput
                    input={item as IInput}
                    changeState={onChangeInputs}
                    error={false}
                    readonly={!!item.readonly}
                  />
                  {showTooltip && item.name === "value" && (
                    <Tooltip
                      title={
                        t("documentingSettings.nextValueTip") +
                        " " +
                        document.nextValue
                      }
                      arrow
                    >
                      <div style={{ color: "red" }}>⚠️</div>
                    </Tooltip>
                  )}{" "}
                </div>
              ))}
            </Stack>
            <Stack direction={"row"}>
              {editDocumentInputs1(document).map((item) => (
                <FormInput
                  input={item as IInput}
                  changeState={onChangeInputs}
                  error={false}
                  readonly={false}
                />
              ))}
            </Stack>
            <Stack
              direction={"row"}
              display={"Flex"}
              justifyContent={"flex-end"}
              paddingTop={6.5}
            >
              <SecondaryButton
                style={classes.btnStyle}
                onClick={() => onUpdateDocument(document)}
                variant="contained"
              >
                {t("documentingSettings.update")}
              </SecondaryButton>
            </Stack>
          </Stack>
        </GoMakeModal>
      </div>
    </div>
  );
};

export { DocumentNumbering };
