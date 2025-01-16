import { GoMakeAutoComplate } from "@/components/auto-complete";
import { useTranslation } from "react-i18next";
import { sections } from "../enums";
import { Sections } from "../interface";
import { useStyle } from "../style";
import { Stack } from "@mui/material";

interface SectionsListProps {
  onChange: (section: string, subSection: string) => void;
  selectedSection: any;
  setSelectedSection: any;
  selectedSubSection: any;
  setSelectedSubSection: any;
}

const SectionsList = ({
  onChange,
  selectedSubSection,
  setSelectedSubSection,
  selectedSection,
  setSelectedSection,
}: SectionsListProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  const mainSections = Object.keys(sections) as Sections[];
  const getSecondarySections = (section: Sections) => sections[section];

  const handleMainSectionChange = (e: any, value: Sections) => {
    setSelectedSection(value);
    setSelectedSubSection("");
    onChange(value, "");
  };

  const handleSubSectionChange = (e: any, value: string) => {
    setSelectedSubSection(value);
    onChange(selectedSection, value);
  };

  return (
    <Stack direction={"row"} width={"100%"} gap={"10px"}>
      <GoMakeAutoComplate
        key={`select--section-${selectedSection}`}
        options={mainSections}
        style={{
          ...classes.selectStyle,
          width: selectedSection ? "50%" : "100%",
        }}
        placeholder={t("customerService.chooseMainSection")}
        onChange={handleMainSectionChange}
        value={selectedSection || null}
        withArrow
      />
      {selectedSection && (
        <GoMakeAutoComplate
          key={`select-sub-section-${selectedSubSection}`}
          options={getSecondarySections(selectedSection)}
          style={{ ...classes.selectStyle, width: "50%" }}
          placeholder={t("customerService.chooseSubSection")}
          onChange={handleSubSectionChange}
          value={selectedSubSection || null}
          withArrow
        />
      )}
    </Stack>
  );
};

export { SectionsList };
