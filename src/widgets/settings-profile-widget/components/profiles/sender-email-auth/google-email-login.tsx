import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useGomakeAxios } from "@/hooks";
import { googleOAuth } from '@/services/api-service/o-auth/o-auth-endpoints';
import { getUserToken } from "@/services/storage-data";

const GoogleAuth = () => {
    const { callApi } = useGomakeAxios();
    const responseGoogle = async (response) => {
        await googleOAuth(callApi, res => console.log(res), { token: response.credential });
    };
    return (
        <GoogleOAuthProvider clientId="1054639123520-kcfuc7f49aghcepko0h9muc2bqi2fdsh.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;