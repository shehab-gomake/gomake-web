import {useGomakeAxios} from "@/hooks/use-gomake-axios";
import {companyProfileState, ICompanyProfile} from "@/store/company-profile";
import {useRecoilState, useSetRecoilState} from "recoil";
import {useSnackBar} from "@/hooks/use-snack-bar";
import {
    getCompanyProfile,
    updateCompanyLogo,
    updateCompanyProfile
} from "@/services/api-service/profiles/company-profile-api";
import {changeProfileImageState} from "@/widgets/settings-profile-widget/state/change-profile-image";

const useCompanyProfile = () => {
    const {callApi} = useGomakeAxios();
    const [profile, setProfile] = useRecoilState<ICompanyProfile>(companyProfileState);
    const setChangeProfileImage = useSetRecoilState<boolean>(changeProfileImageState);
    const {alertFaultUpdate, alertSuccessUpdate} = useSnackBar();
    const getProfile = async () => {
        await getCompanyProfile(callApi, setProfile)
    }

    const updateProfileChanges = async () => {
        const res = await updateCompanyProfile(callApi, undefined, {...profile});
        if (res.success) {
            alertSuccessUpdate();
        } else {
            alertFaultUpdate();
        }
    }
    const profileChange = (newProfile: ICompanyProfile) => {
        setProfile(newProfile);
    }

    const changeCompanyProfileImage = async (file: any) => {
        setProfile({...profile, logo: ''});
        const res = await updateCompanyLogo(callApi, undefined, {fileBase64: file, printHouseLogoType: 1})
        if (res.success) {
            setProfile({
                ...profile,
                logo: res.data?.url
            })
        }
        setChangeProfileImage(false);
        return res.success
    }
    const changeCompanyLoginImage = async (file: any) => {
        setProfile({...profile, loginLogo: ''});
        const res = await updateCompanyLogo(callApi, undefined, {fileBase64: file, printHouseLogoType: 2})
        if (res.success) {
            setProfile({
                ...profile,
                loginLogo: res.data?.url
            })
        }
        setChangeProfileImage(false);
        return res.success
    }

    return {
        getProfile,
        profile,
        profileChange,
        updateProfileChanges,
        setProfile,
        changeCompanyProfileImage,
        changeCompanyLoginImage
    }
};

export {useCompanyProfile}
