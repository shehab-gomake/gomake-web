import { printHousePreferencesState } from "@/store/print-house-preferences";
import { useRecoilValue } from "recoil";
import { EPreferences } from "@/enums/prefernces";

const usePrintHousePreferences = () => {
  const preferences = useRecoilValue<any>(printHousePreferencesState);

  const CheckPreferenceValue = (key: string): string | boolean | undefined => {
    const preference = preferences.find((pref: any) => pref.code === key);

    if (!preference) {
      return undefined;
    }

    // Interpret "true" and "false" strings as boolean values
    if (preference.value === "true") {
      return true;
    }

    if (preference.value === "false") {
      return false;
    }
    return preference.value;
  };

  const GetProductionFontSizeFromPreferences = (): string => {
    const preference = preferences.find(
      (pref: any) => pref.code === EPreferences.PRODUCTION_FLOOR_TABLE_FONT_SIZE
    );

    if (!preference) {
      return "15px";
    }
    return `${preference.value}px`;
  };

  const GetPreferenceValueKey = (key: string): string | undefined => {
    const preference = preferences.find((pref: any) => pref.code === key);
    return preference?.valueKey;
  };

  return {
    CheckPreferenceValue,
    GetProductionFontSizeFromPreferences,
    GetPreferenceValueKey,
  };
};

export { usePrintHousePreferences };
