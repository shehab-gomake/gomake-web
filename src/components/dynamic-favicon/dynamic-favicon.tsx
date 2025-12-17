import { useEffect, useState } from "react";
import Head from "next/head";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getCompanyProfile } from "@/services/api-service/profiles/company-profile-api";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { useRecoilState } from "recoil";

const DynamicFavicon: React.FC = () => {
  const { callApi } = useGomakeAxios();
  const [profile, setProfile] = useRecoilState<ICompanyProfile>(companyProfileState);

  console.log("profile1", profile);

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

  // Only use loginLogo if available - no default fallback
  const imageUrl = profile?.loginLogo;
  const siteName = profile?.name || "Gomake";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Only render meta tags if loginLogo exists
  if (!imageUrl) {
    return (
      <Head>
        {/* Favicon only - no social media tags without loginLogo */}
        <link rel="icon" href="https://gomake-translations.s3.eu-central-1.amazonaws.com/favicon.ico" />
      </Head>
    );
  }

  return (
    <Head>
      {/* Favicon */}
      <link rel="icon" href={imageUrl} />
      <link rel="shortcut icon" href={imageUrl} />
      <link rel="apple-touch-icon" href={imageUrl} />

      {/* Open Graph / Facebook - Only when loginLogo exists */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteName} />
      <meta property="og:description" content="Gomake - Print Management System" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card - Only when loginLogo exists */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteName} />
      <meta name="twitter:description" content="Gomake - Print Management System" />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional meta tags for better compatibility */}
      <meta name="image" content={imageUrl} />
    </Head>
  );
};

export { DynamicFavicon };

