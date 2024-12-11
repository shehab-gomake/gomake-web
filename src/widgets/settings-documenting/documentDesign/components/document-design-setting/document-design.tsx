import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect } from "react";
import { CircularProgress, Stack, TextareaAutosize } from "@mui/material";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { QRCodes } from "./QRCodes/QRCodes";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const DocumentDesign = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { primaryColor } = useGomakeTheme();

  const {
    DocumentDesignSection1,
    DocumentDesignSection2,
    documentDesign,
    getDocumentDesignByCreationDoc,
    handleChangeComments,
    onChangeInputs,
    addDocumentDesign,
    ResetDefaultDocumentDesign,
    isLoading,
    setIsLoading,
  } = UseDocumentDesign();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await getDocumentDesignByCreationDoc(
          documentDesign?.docType,
          documentDesign?.agentId
        );
      } catch (error) {
        console.error("Failed to load document design", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [documentDesign?.docType, documentDesign?.agentId]); // Re-run whenever docType or agentId changes

  return (
    <div style={classes.container} className="custom-scrollbar">
      {isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column" as "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative" as "relative",
            height: "100%",
          }}
        >
          <CircularProgress
            size="60px"
            thickness={2}
            style={{ color: primaryColor(600) }}
          />
        </div>
      ) : (
        <Stack direction={"column"} gap={"24px"}>
          {DocumentDesignSection1.map((section) => (
            <FormInputsSectionComponent
              sectionTitle={section.title}
              key={section.title}
            >
              {section.inputs.map((companyInput) => (
                <FormInput
                  key={companyInput.parameterKey}
                  input={companyInput as IInput}
                  changeState={onChangeInputs}
                  error={false}
                />
              ))}
            </FormInputsSectionComponent>
          ))}
        </Stack>
      )}

      {!isLoading && (
        <>
          <Stack direction={"row"} marginTop={"24px"}>
            <span style={classes.subTitleStyle}>
              {t("documentingDesign.Additional.Additional")}
            </span>
          </Stack>

          <Stack direction={"row"} marginTop={"24px"}>
            <span style={classes.subTitleSpanStyle}>
              {t("documentingDesign.Additional.Remarks")}
            </span>
          </Stack>

          <Stack direction={"row"} marginTop={"24px"}>
            <TextareaAutosize
              style={classes.textAreaStyle}
              value={documentDesign?.notes || ""}
              onChange={handleChangeComments}
            />
          </Stack>

          <Stack direction={"column"} gap={"32px"} paddingTop={"44px"}>
            {DocumentDesignSection2.map((section) => (
              <FormInputsSectionComponent sectionTitle={section.title}>
                {section.inputs.map((companyInput) => (
                  <FormInput
                    key={companyInput.parameterKey}
                    input={companyInput as IInput}
                    changeState={onChangeInputs}
                    error={false}
                  />
                ))}
              </FormInputsSectionComponent>
            ))}
          </Stack>

          <QRCodes />

          <div
            style={{
              ...classes.footerStyle,
              marginRight: dir == "ltr" ? "10px" : "0px",
              marginLeft: dir == "rtl" ? "10px" : "0px",
            }}
          >
            <SecondaryButton
              style={{ width: "fit-content" }}
              onClick={ResetDefaultDocumentDesign}
              variant="outlined"
            >
              {t("documentingDesign.Reset")}
            </SecondaryButton>

            <SecondaryButton
              style={{ width: "fit-content" }}
              onClick={addDocumentDesign}
              variant="contained"
            >
              {t("documentingDesign.Save")}
            </SecondaryButton>
          </div>
        </>
      )}
    </div>
  );
};

export { DocumentDesign };
