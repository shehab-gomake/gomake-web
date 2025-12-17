import { useEffect, useState } from "react";
import Head from "next/head";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getCompanyProfile } from "@/services/api-service/profiles/company-profile-api";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { useRecoilState } from "recoil";

const DynamicFavicon: React.FC = () => {
  const { callApi } = useGomakeAxios();
  const [profile, setProfile] = useRecoilState<ICompanyProfile>(companyProfileState);

  console.log("profile", profile);

  const getProfile = async () => {
    const callBack = (res) => {
      if (res.success) {
        setProfile(res.data);
      }
    };
    await getCompanyProfile(callApi, callBack);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Head>
      <link rel="icon" href={profile?.loginLogo} />
    </Head>
  );
};

export { DynamicFavicon };

