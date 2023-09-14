import {useRecoilState, useSetRecoilState} from "recoil";
import {IUserProfile, userProfileState} from "@/store/user-profile";
import {
    getUserProfile, resetUserInitials, resetUserPassword,
    updateUserProfile,
    updateUserProfileImage
} from "@/services/api-service/profiles/user-profile-api";
import {useGomakeAxios} from "@/hooks/use-gomake-axios";
import {useSnackBar} from "@/hooks/use-snack-bar";
import {
    changeProfileImageState,
    changeProfileInitialsState
} from "@/widgets/settings-profile-widget/state/change-profile-image";

const useUserProfile = () => {
    const [profileState, setProfileState] = useRecoilState<IUserProfile>(userProfileState);
    const {callApi} = useGomakeAxios();
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
    const setChangeProfileImage = useSetRecoilState<boolean>(changeProfileImageState);
    const setInitialsModal = useSetRecoilState(changeProfileInitialsState)


    const getProfile = async () => {
        const callBack = (res) => {
            if (res.success) {
                setProfileState(res.data);
            }
        }

        await getUserProfile(callApi, callBack);
    }
    const updateProfile = async () => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await updateUserProfile(callApi, callBack, profileState);
    }
    const changeUserProfileImage = async (file: any) => {
        const callBack = (res) => {
            if (res.success) {
                setProfileState({...profileState, imagePath: res.data?.url});
                setChangeProfileImage(false);
            }
        }

        setProfileState({...profileState, imagePath: ''})
        const res = await updateUserProfileImage(callApi, callBack, {userId: profileState.id, fileBase64: file});
        return res.success
    }

    const updateUserInitials = async (data: {
        avatarBackGroundColor: string,
        avatarInitials: string
    }) => {
        const callBack = (res) => {
            if (res.success) {
                setProfileState({...profileState, ...data, imagePath: ''})
                setInitialsModal(false);
                alertSuccessUpdate()
            } else {
                alertFaultUpdate()
            }
        }

        await resetUserInitials(callApi, callBack, {...data, id: profileState.id});
    }

    const updateUserPassword = async (data: {
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    }) => {

        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await resetUserPassword(callApi, callBack, {id: profileState.id, ...data})
    }
    return {
        updateProfile,
        getProfile,
        changeUserProfileImage,
        updateUserInitials,
        updateUserPassword,
        profileState
    }
}

export {useUserProfile}