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
        await getUserProfile(callApi, setProfileState);
    }
    const updateProfile = async () => {
        const res = await updateUserProfile(callApi, undefined, profileState);
        if (res.success) {
            alertSuccessUpdate();
        } else {
            alertFaultUpdate();
        }
    }
    const changeUserProfileImage = async (file: any) => {
        setProfileState({...profileState, imagePath: ''})
        const res = await updateUserProfileImage(callApi, undefined, {userId: profileState.id, fileBase64: file});
        if (res.success) {
           setProfileState({...profileState, imagePath: res.data?.url});
        }
        setChangeProfileImage(false);
        return res.success
    }

    const updateUserInitials = async (data: {
        avatarBackGroundColor: string,
        avatarInitials: string
    }) => {
        const res = await resetUserInitials(callApi, undefined, {...data, id: profileState.id});
        if (res.success) {
            setProfileState({...profileState, ...data, imagePath: ''})
            setInitialsModal(false);
            alertSuccessUpdate()
        }else {
            alertFaultUpdate()
        }
    }

    const updateUserPassword = async (data: {
        currentPassword: string,
        newPassword: string,
        confirmPassword: string
    }) => {
        const res = await resetUserPassword(callApi, undefined, {id: profileState.id, ...data})
        if (res.success) {
            alertSuccessUpdate();
        }else {
            alertFaultUpdate();
        }
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