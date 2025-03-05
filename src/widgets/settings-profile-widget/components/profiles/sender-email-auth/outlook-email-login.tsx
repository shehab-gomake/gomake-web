import {Button} from "@mui/material";
import {useRecoilState} from "recoil";
import {userProfileState} from "@/store/user-profile";

const clientId = '4cd84b63-7bfd-435a-9d72-27f906853fe7';
const redirectUri = 'https://3097-176-106-228-38.ngrok-free.app/api/CallBack/OutlookAuthToken'; // Match the redirect URI in Azure
const scope = 'Mail.Send'; // Required permission

const OutlookEmailLoginComponent =  () => {
    const [state, setState] = useRecoilState(userProfileState);
    const buttonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#0078d4', // Microsoft's brand color
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        height: '39px',
    };

    const logoStyle = {
        width: '24px',
        height: '24px',
        marginRight: '10px',
    };

    const getAuthUrl = () => {
        const customState = JSON.stringify({
            userId: state.userId,
        });

        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&response_mode=query&state=${encodeURIComponent(customState)}`;

    }
    return (
        <Button  href={getAuthUrl()} target="_blank" style={buttonStyle}>
            <img
                src="https://img.icons8.com/color/48/000000/microsoft-outlook-2019--v1.png"
                alt="Outlook Logo"
                style={logoStyle}
            />
            <span>Sign in to Outlook</span>
        </Button>
    );
};

export { OutlookEmailLoginComponent };