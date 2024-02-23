import {clearStorage} from "@/services/storage-data";
import {systemCurrencyState, systemVATState, userState} from "@/store";
import {permissionsState} from "@/store/permissions";
import {useCallback, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {useGomakeAxios} from "./use-gomake-axios";
import {useGomakeRouter} from "./use-gomake-router";
import {userTypeState} from "@/store/user-type";
import {userProfileState} from "@/store/user-profile";
import {useTranslation} from "react-i18next";
import {Permissions} from "@/components/CheckPermission/enum";
import {printHouseProfile} from "@/store/print-house-profile";


const useCustomer = (permissionEnumValue?:Permissions,allowAnonymous?:boolean) => {

    const {callApi} = useGomakeAxios();
    const [user, setUser] = useRecoilState<any>(userState);
    const [systemCurrency, setSystemCurrency] = useRecoilState<any>(systemCurrencyState);
    const [systemVAT, setSystemVAT] = useRecoilState<number>(systemVATState);
    const setUserProfile = useSetRecoilState(userProfileState);
    const setPrintHouseProfile = useSetRecoilState(printHouseProfile);
    const [userType, setUserType] = useRecoilState<any>(userTypeState);
    const [adminsAutoComplate, setAdminsAutoComplate] = useState([]);
    const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
    const {navigate} = useGomakeRouter();

    const {i18n} = useTranslation();
    const logOut = useCallback(() => {
        setUser({});
        clearStorage();
        navigate("/");
    }, []);

    const validate = useCallback(async () => {
        debugger
        if(allowAnonymous){
            return true;
        }
        const validate: any = await callApi("GET", "/v1/auth/validate");
        if (validate?.success) {
            const user = validate?.data?.data?.customer;
            // user.redirectTo = '/quick-setup/machines';
            const userPermissions = [...user.permissions];
            user.permissions = null;
            setUser({...user, type: "user"});
            setUserType({type: "user"});
            setUserProfile(validate?.data?.data?.customer);
            setPrintHouseProfile(user.printHouseProfile);
            setSystemCurrency(user.systemCurrency)
            setSystemVAT(user.systemVat);
            localStorage.setItem('systemLogo', validate?.data?.data?.customer?.printHouseProfile?.logo)
            if (validate?.data?.data?.customer?.systemLang) {
                localStorage.setItem('systemLanguage', validate?.data?.data?.customer?.systemLang)
                i18n.changeLanguage(validate?.data?.data?.customer?.systemLang).then();
            }
            if (!!user?.redirectTo) {
                navigate(user?.redirectTo);
            }
            setPermissions(userPermissions);
            if (permissionEnumValue !== null && permissionEnumValue !== undefined) {

                if (userPermissions) {
                    return !!userPermissions?.includes(permissionEnumValue);
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
            return {op};
        },
        [permissions]
    );

    return {
        adminsAutoComplate,
        user,
        setUser,
        logOut,
        checkPermission,
        getPermission,
        setPermissions,
        validate,
    };
};

export {useCustomer};
