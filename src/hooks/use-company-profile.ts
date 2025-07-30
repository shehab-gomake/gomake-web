import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useSnackBar } from "@/hooks/use-snack-bar";
import {
  checkPrintHouseTaxLoginApi,
  getCompanyLoginLogo,
  getCompanyProfile,
  printHouseTaxLogoutApi,
  updateCompanyLogo,
  updateCompanyProfile,
} from "@/services/api-service/profiles/company-profile-api";
import { changeProfileImageState } from "@/widgets/settings-profile-widget/state/change-profile-image";
import { useTranslation } from "react-i18next";
import { getCurrencies } from "@/services/api-service/general/enums";
import { currenciesState } from "@/widgets/materials-widget/state";
import { useState } from "react";
import { convertTimeToDate } from "@/widgets/employees-working-hours-widgets/use-working-hours";
import { useModal } from "./use-modal";
import { connectToStripeApi } from "@/services/api-service/print-houses/connect-to-stripe-api";
import router from "next/router";

const countryList = require("country-list");
const allCountries = countryList.getNames();
const allCountryCodes = countryList.getCodes();
export const countriesWithCodes = allCountries.map((country, index) => ({
  text: country,
  value: allCountryCodes[index],
}));

const useCompanyProfile = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const alertLogOutModal = useModal();
  const [profile, setProfile] =
    useRecoilState<ICompanyProfile>(companyProfileState);
  const setChangeProfileImage = useSetRecoilState<boolean>(
    changeProfileImageState
  );
  const [currencies, setCurrencies] =
    useRecoilState<{ label: string; value: string }[]>(currenciesState);

  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const getProfile = async () => {
    const callBack = (res) => {
      if (res.success) {
        setProfile(res.data);
      }
    };
    await getCompanyProfile(callApi, callBack);
  };

  const getCompanyLogo = async () => {
    const callBack = (res) => {
      if (res.success) {
        // setProfile({ ...profile, loginLogo: res.data?.loginLogo });
      }
    };
    await getCompanyLoginLogo(callApi, callBack);
  };

  const updateProfileChanges = async () => {
    const tab = router?.query?.tab;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await updateCompanyProfile(callApi, callBack, { ...profile,selectedTab: tab });
  };
  const profileChange = (newProfile: ICompanyProfile) => {
    setProfile(newProfile);
  };

  const changeCompanyProfileImage = async (file: any) => {
    const callBack = (res) => {
      if (res.success) {
        setProfile({
          ...profile,
          logo: res.data?.url,
        });
        setChangeProfileImage(false);
        window.location.reload();
      }
    };
    const res = await updateCompanyLogo(callApi, callBack, {
      fileBase64: file,
      printHouseLogoType: 1,
    });

    return res.success;
  };
  const changeCompanyLoginImage = async (file: any) => {
    const callBack = (res) => {
      if (res.success) {
        setProfile({
          ...profile,
          loginLogo: res.data?.url,
        });
        setChangeProfileImage(false);
      }
    };
    const res = await updateCompanyLogo(callApi, callBack, {
      fileBase64: file,
      printHouseLogoType: 2,
    });
    
    return res.success;
  };

  const connectToStripe = async () => {
    const callBack = (res) => {
      if (res.success) {
        const url = res.data;
        if (url) {
          window.location.href = url;
        } else {
          console.error("Received an invalid URL from the API.");
        }
      }
    };
    await connectToStripeApi(callApi, callBack);
  };

  const daysOfWork = [
    { value: "0", label: t("profileSettings.sunday") },
    { value: "1", label: t("profileSettings.monday") },
    { value: "2", label: t("profileSettings.tuesday") },
    { value: "3", label: t("profileSettings.wednesday") },
    { value: "4", label: t("profileSettings.thursday") },
    { value: "5", label: t("profileSettings.friday") },
    { value: "6", label: t("profileSettings.saturday") },
  ];

  const getCurrenciesApi = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCurrencies(
          res.data.map(({ value, text }) => ({ label: text, value }))
        );
      }
    };
    await getCurrencies(callApi, callBack);
  };

  const [taxLoginInfo, setTaxLoginInfo] = useState({
    isLoggedIn: false,
    loginUrl: "",
    lastLoginDate: null as Date | null,
  });

  const checkPrintHouseTaxLogin = async () => {
    const callBack = (res) => {
      if (res.success) {
        const { isLoggedIn, loginUrl, lastLoginDate } = res.data;
        setTaxLoginInfo({
          isLoggedIn,
          loginUrl,
          lastLoginDate: lastLoginDate ? new Date(lastLoginDate) : null,
        });
      }
    };
    await checkPrintHouseTaxLoginApi(callApi, callBack);
  };

  const printHouseTaxLogout = async () => {
    const callBack = (res) => {
      if (res.success) {
        const { isLoggedIn, loginUrl } = res.data;
        setTaxLoginInfo({
          isLoggedIn,
          loginUrl,
          lastLoginDate: null,
        });
      }
    };
    await printHouseTaxLogoutApi(callApi, callBack);
  };

  const onToggleWorkingDays = (toggledDay: number) => {
    setProfile((p) => ({
      ...p,
      businessDays: {
        ...p.businessDays,
        days: p.businessDays.days?.includes(toggledDay)
          ? p.businessDays.days.filter((d) => d !== toggledDay)
          : [...p.businessDays.days, toggledDay],
      },
    }));
  };

  const onWorkingTimeChange = (
    field: "startTime" | "endTime",
    value: string
  ) => {
    setProfile((profile) => ({
      ...profile,
      businessDays: {
        ...profile.businessDays,
        [field]: convertTimeToDate(value),
      },
    }));
  };

  const updatePinPadState = (key, value: any) => {
    const updatedValue = value?.map((row) =>
      row.isActive === undefined ? { ...row, isActive: true } : row
    );

    profileChange({
      ...profile,
      pinPads: updatedValue,
    });
  };

  return {
    t,
    getProfile,
    profile,
    profileChange,
    updateProfileChanges,
    setProfile,
    changeCompanyProfileImage,
    changeCompanyLoginImage,
    getCompanyLogo,
    daysOfWork,
    getCurrenciesApi,
    currencies,
    countriesWithCodes,
    checkPrintHouseTaxLogin,
    taxLoginInfo,
    onToggleWorkingDays,
    onWorkingTimeChange,
    updatePinPadState,
    printHouseTaxLogout,
    alertLogOutModal,
    connectToStripe,
  };
};

export { useCompanyProfile };
