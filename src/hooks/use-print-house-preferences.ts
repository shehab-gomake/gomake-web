import { printHousePreferencesState } from "@/store/print-house-preferences";
import { useRecoilValue } from "recoil";

const usePrintHousePreferences = () => {
  const preferences = useRecoilValue<any>(printHousePreferencesState);

  const CheckPreferenceValue = (key: string): string | undefined => {
    const preference = preferences.find((pref: any) => pref.code === key);
    return preference ? preference.value : undefined;
  };

  return {
    CheckPreferenceValue,
  };
};

export { usePrintHousePreferences };
