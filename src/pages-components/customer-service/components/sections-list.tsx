import { GoMakeAutoComplate } from "@/components/auto-complete";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { sections } from "../enums";
import { Sections } from "../interface";
import { useState } from "react";

interface SectionsListProps {
  onChange: (section: string, subSection: string) => void;
}

const SectionsList = ({ onChange }: SectionsListProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const [selectedSection, setSelectedSection] = useState<Sections | "">("");
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");

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
    <>
      <GoMakeAutoComplate
        options={mainSections}
        style={{ height: "40px", width: "100%", border: "none" }}
        placeholder={t("customerService.chooseMainSection")}
        onChange={handleMainSectionChange}
        value={selectedSection}
        withArrow
      />
      {selectedSection && (
        <GoMakeAutoComplate
          options={getSecondarySections(selectedSection)}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.chooseSubSection")}
          onChange={handleSubSectionChange}
          value={selectedSubSection}
          withArrow
        />
      )}
    </>
  );
};

export { SectionsList };
