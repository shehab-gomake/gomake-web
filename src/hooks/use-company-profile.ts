import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useSnackBar } from "@/hooks/use-snack-bar";
import {
    getCompanyLoginLogo,
    getCompanyProfile,
    updateCompanyLogo,
    updateCompanyProfile
} from "@/services/api-service/profiles/company-profile-api";
import { changeProfileImageState } from "@/widgets/settings-profile-widget/state/change-profile-image";
import { useTranslation } from "react-i18next";

const
    useCompanyProfile = () => {
        const { callApi } = useGomakeAxios();
        const { t } = useTranslation();
        const [profile, setProfile] = useRecoilState<ICompanyProfile>(companyProfileState);
        const setChangeProfileImage = useSetRecoilState<boolean>(changeProfileImageState);
        const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
        const getProfile = async () => {
            const callBack = (res) => {
                if (res.success) {
                    setProfile(res.data);
                }
            }
            await getCompanyProfile(callApi, callBack)
        }

        const getCompanyLogo = async () => {
            const callBack = (res) => {
                if (res.success) {
                    setProfile({ ...profile, loginLogo: res.data });
                }
            }
            await getCompanyLoginLogo(callApi, callBack);
        }

        const updateProfileChanges = async () => {
            const callBack = (res) => {
                if (res.success) {
                    alertSuccessUpdate();
                } else {
                    alertFaultUpdate();
                }
            }
            await updateCompanyProfile(callApi, callBack, { ...profile });

        }
        const profileChange = (newProfile: ICompanyProfile) => {
            setProfile(newProfile);
        }

        const changeCompanyProfileImage = async (file: any) => {
            const callBack = (res) => {
                if (res.success) {
                    setProfile({
                        ...profile,
                        logo: res.data?.url
                    })
                    setChangeProfileImage(false);
                }
            }
            const res = await updateCompanyLogo(callApi, callBack, { fileBase64: file, printHouseLogoType: 1 })

            return res.success
        }
        const changeCompanyLoginImage = async (file: any) => {
            const callBack = (res) => {
                if (res.success) {
                    setProfile({
                        ...profile,
                        loginLogo: res.data?.url
                    })
                    setChangeProfileImage(false);
                }
            }
            const res = await updateCompanyLogo(callApi, callBack, { fileBase64: file, printHouseLogoType: 2 })

            return res.success
        }

        const daysOfWork = [
            { value: '0', label: t("profileSettings.sunday") },
            { value: '1', label: t("profileSettings.monday") },
            { value: '2', label: t("profileSettings.tuesday") },
            { value: '3', label: t("profileSettings.wednesday") },
            { value: '4', label: t("profileSettings.thursday") },
            { value: '5', label: t("profileSettings.friday") },
            { value: '6', label: t("profileSettings.saturday") },
        ];

        return {
            getProfile,
            profile,
            profileChange,
            updateProfileChanges,
            setProfile,
            changeCompanyProfileImage,
            changeCompanyLoginImage,
            getCompanyLogo,
            daysOfWork
        }
    };

export { useCompanyProfile }