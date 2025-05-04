import { clearStorage, updateTokenStorage } from "@/services/storage-data";
import { systemCurrencyState, systemVATState, userState } from "@/store";
import { permissionsState } from "@/store/permissions";
import { useCallback, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { useGomakeRouter } from "./use-gomake-router";
import { userTypeState } from "@/store/user-type";
import { userProfileState } from "@/store/user-profile";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import {
  isUsPrintHouseState,
  printHouseProfile,
} from "@/store/print-house-profile";
import { priceChangePercentsState } from "@/store/min-max-price-change-percents";
import { printHousePreferencesState } from "@/store/print-house-preferences";
import { versionState } from "@/store/version";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { getPrintHouseSetupStepsApi } from "@/services/api-service/quick-setup-menu/set-up-products-api";
import {
  printHouseSetupStepsState,
  SetupStepItem,
} from "@/store/print-house-setup-state-state";

const useCustomer = (
  permissionEnumValue?: Permissions,
  allowAnonymous?: boolean
) => {
  const { callApi } = useGomakeAxios();
  const setPrintHouseSetupSteps = useSetRecoilState<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  const [user, setUser] = useRecoilState<any>(userState);
  const setSystemCurrency = useSetRecoilState<any>(systemCurrencyState);
  const setSystemVAT = useSetRecoilState<number>(systemVATState);
  const setUserProfile = useSetRecoilState(userProfileState);
  const setPrintHouseProfile = useSetRecoilState(printHouseProfile);
  const setPriceChangePercents = useSetRecoilState(priceChangePercentsState);
  const [isLanguageUpdated, setIsLanguageUpdated] = useState<boolean>(false);
  const setUserType = useSetRecoilState<any>(userTypeState);
  const [adminsAutoComplate] = useState([]);
  const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
  const { navigate } = useGomakeRouter();
  const setPrintHousePreferences = useSetRecoilState<any>(
    printHousePreferencesState
  );
  const setIsUsPrintHouse = useSetRecoilState<any>(isUsPrintHouseState);
  const setVersionState = useSetRecoilState(versionState);
  const setShowSetupMenu = useSetRecoilState(setupGuideOpenState);

  const { i18n } = useTranslation();
  const logOut = useCallback(() => {
    setUser({});
    clearStorage();
    navigate("/");
  }, []);

  const validate = useCallback(async () => {
    if (allowAnonymous) {
      return true;
    }
    const validate: any = await callApi("GET", "/v1/auth/validate");
    if (validate?.success) {
      const user = validate?.data?.data?.customer;
      updateTokenStorage(user?.token);
      const userPermissions = [...user.permissions];
      user.permissions = null;
      if (user?.isFirstLogin) {
        // setStartGuid(true);
        // localStorage.setItem("isHover", "true");
      }
      setUser({ ...user, type: "user" });
      setUserType({ type: "user" });
      setUserProfile(validate?.data?.data?.customer);
      setPrintHouseProfile(user.printHouseProfile);
      setIsUsPrintHouse(user.printHouseProfile?.country === "US");
      setPrintHousePreferences(user?.printHouseProfile?.preferences);
      //setSystemCurrency(user.systemCurrency)
      setSystemCurrency(user.printHouseProfile.systemCurrency);
      setSystemVAT(user.systemVat);
      //setVersionState(user.appVersion);
      setShowSetupMenu(user?.showSetupMenu);
      const appVersion = user.appVersion;
      const userAppVersion = localStorage.getItem("appVersion");
      if (!userAppVersion) {
        localStorage.setItem("appVersion", appVersion);
      }
      if (userAppVersion && appVersion && userAppVersion !== appVersion) {
        localStorage.setItem("appVersion", appVersion);
        window.location.reload();
      }
      setPriceChangePercents({
        minPercent: user?.minPriceChangePercents,
        maxPercent: user?.maxPriceChangePercents,
      });
      localStorage.setItem(
        "systemLogo",
        validate?.data?.data?.customer?.printHouseProfile?.logo
      );
      if (validate?.data?.data?.customer?.systemLang) {
        localStorage.setItem(
          "systemLanguage",
          validate?.data?.data?.customer?.systemLang
        );
        i18n
          .changeLanguage(validate?.data?.data?.customer?.systemLang, () =>
            setIsLanguageUpdated(true)
          )
          .then();
      }
      if (!!user?.redirectTo) {
        navigate(user?.redirectTo);
      }
      setPermissions(userPermissions);
      if (permissionEnumValue !== null && permissionEnumValue !== undefined) {
        if (userPermissions) {
          const isPermission: boolean =
            !!userPermissions?.includes(permissionEnumValue);
          if (!isPermission) {
            navigate("/login");
          }

          return isPermission;
        } else {
          return false;
        }
      }
      return true;
    }
    clearStorage();
    navigate("/login");
    return false;
  }, []);

  const checkPermission = useCallback(
    (permission: string) => {
      let canAccess = false;
      const index = permissions.findIndex(
        (item: any) => item.route === permission
      );
      if (index !== -1) {
        canAccess = true;
      }
      return canAccess;
    },
    [permissions]
  );

  const getPermission = useCallback(
    (permission: string) => {
      const _permissions = permissions.filter(
        (item: any) => item.route === permission
      );
      let op = "";
      if (
        _permissions[0]?.op === "read" ||
        _permissions[1]?.op === "read" ||
        _permissions[2]?.op === "read"
      ) {
        op = "read";
      }
      if (
        _permissions[0]?.op === "write" ||
        _permissions[1]?.op === "write" ||
        _permissions[2]?.op === "write"
      ) {
        op = "write";
      }
      if (
        _permissions[0]?.op === "admin" ||
        _permissions[1]?.op === "admin" ||
        _permissions[2]?.op === "admin"
      ) {
        op = "admin";
      }
      return { op };
    },
    [permissions]
  );

  const getPrintHouseSetupSteps = async () => {
    const callBack = (res) => {
      if (res.success) {
        setPrintHouseSetupSteps(res?.data);
      }
    };

    await getPrintHouseSetupStepsApi(callApi, callBack);
  };

  return {
    adminsAutoComplate,
    user,
    setUser,
    logOut,
    checkPermission,
    getPermission,
    setPermissions,
    validate,
    isLanguageUpdated,
    getPrintHouseSetupSteps,
  };
};

export { useCustomer };
