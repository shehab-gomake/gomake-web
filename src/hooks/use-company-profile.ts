import {useGomakeAxios} from "@/hooks/use-gomake-axios";
import {companyProfileState, ICompanyProfile} from "@/store/user-profile";
import {useRecoilState} from "recoil";
import {useSnackBar} from "@/hooks/use-snack-bar";

const useCompanyProfile = () => {
    const {callApi} = useGomakeAxios();
    const [profile, setProfile] = useRecoilState<ICompanyProfile>(companyProfileState);
    const {setSnackbarStateValue} = useSnackBar();
    const getProfile = async () => {
        const res = await callApi("GET", '/v1/get-print-house-profile');
        if (res.success) {
            setProfile(res?.data?.data);
        }
    }

    const updateProfileChanges = async () => {
        const res = await callApi('POST', '/v1/update-print-house-profile', {...profile});
    }
    const profileChange = (newProfile: ICompanyProfile) => {
        setProfile(newProfile);
    }
    return {
        getProfile,
        profile,
        profileChange,
        updateProfileChanges,
        setProfile
    }
};

export {useCompanyProfile}
