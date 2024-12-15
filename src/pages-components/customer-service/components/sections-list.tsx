import { GoMakeAutoComplate } from "@/components/auto-complete";
import { useTranslation } from "react-i18next";
import { sections } from "../enums";
import { Sections } from "../interface";

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
        key={`select--section-${selectedSection}`}
        options={mainSections}
        style={{ height: "40px", width: "100%", border: "none" }}
        placeholder={t("customerService.chooseMainSection")}
        onChange={handleMainSectionChange}
        value={selectedSection || null}
        withArrow
      />
      {selectedSection && (
        <GoMakeAutoComplate
          key={`select-sub-section-${selectedSubSection}`}
          options={getSecondarySections(selectedSection)}
          style={{ height: "40px", width: "100%", border: "none" }}
          placeholder={t("customerService.chooseSubSection")}
          onChange={handleSubSectionChange}
          value={selectedSubSection || null}
          withArrow
        />
      )}
    </>
  );
};

export { SectionsList };
