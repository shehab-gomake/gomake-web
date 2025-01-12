import { printHousePreferencesState } from "@/store/print-house-preferences";
import { useRecoilValue } from "recoil";

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

  return {
    CheckPreferenceValue,
  };
};

export { usePrintHousePreferences };
