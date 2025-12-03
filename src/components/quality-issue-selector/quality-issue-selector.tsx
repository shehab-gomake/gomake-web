import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { getQualityIssueReasonsApi } from "@/services/api-service/quotes/qoutes-endpoints";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { Paper, MenuItem } from "@mui/material";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { useStyle } from "./style";

interface QualityIssueSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QualityIssueSelector = ({
  value,
  onChange,
  placeholder,
}: QualityIssueSelectorProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const printHouse = useRecoilValue(printHouseProfile);
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [existingReasons, setExistingReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (printHouse?.id) {
      fetchExistingReasons();
    }
  }, [printHouse?.id]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const fetchExistingReasons = async () => {
    if (!printHouse?.id) return;

    setLoading(true);
    const callBack = (res) => {
      if (res?.success && res?.data) {
        setExistingReasons(res.data || []);
      }
      setLoading(false);
    };
    await getQualityIssueReasonsApi(callApi, callBack, printHouse.id);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setOpenDropdown(true);
  };

  const handleSelectReason = (selectedReason: string) => {
    setInputValue(selectedReason);
    onChange(selectedReason);
    setOpenDropdown(false);
  };

  const handleInputClick = () => {
    setOpenDropdown(true);
  };

  // Filter options based on input value
  const filteredReasons = existingReasons.filter((r) =>
    r.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Check if inputValue matches any existing reason
  const isNewReason =
    inputValue &&
    !existingReasons.find((r) => r.toLowerCase() === inputValue.toLowerCase());

  return (
    <div style={classes.container}>
      <GomakeTextInput
        placeholder={placeholder || t("productionFloor.qualityIssueReason")}
        style={classes.textInputStyle}
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
      />
      {openDropdown && !loading && (
        <ClickOutside onClick={() => setOpenDropdown(false)}>
          <Paper style={classes.dropdownPaper}>
            {isNewReason && (
              <MenuItem
                onClick={() => handleSelectReason(inputValue)}
                sx={{ fontWeight: 500 }}
              >
                {t("productionFloor.addNewReason")}: "{inputValue}"
              </MenuItem>
            )}
            {filteredReasons.map((reasonOption) => (
              <MenuItem
                key={reasonOption}
                onClick={() => handleSelectReason(reasonOption)}
                selected={reasonOption === value}
              >
                {reasonOption}
              </MenuItem>
            ))}
            {filteredReasons.length === 0 && !isNewReason && (
              <MenuItem disabled>
                {t("productionFloor.noReasonsFound")}
              </MenuItem>
            )}
          </Paper>
        </ClickOutside>
      )}
    </div>
  );
};

export { QualityIssueSelector };
