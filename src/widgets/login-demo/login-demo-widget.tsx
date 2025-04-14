import { useEffect } from "react";
import { useRouter } from "next/router";
import { updateTokenStorage } from "@/services/storage-data";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";

export default function LoginDemoWidget({
  userId,
}: {
  userId?: string | string[];
}) {
  const router = useRouter();

  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();

  const getDemoUserToken = async () => {
    if (!router.isReady) return;
    const TokenRes: any = await callApi("GET", "/v1/auth/get-demo-user-token", {
      userId,
    });

    if (TokenRes?.success) {
      const userToken = TokenRes?.data?.data?.result?.token;
      if (!userToken) {
        navigate("/login");
      }
      updateTokenStorage(userToken);
      navigate("/home");
    } else {
      navigate("/login");
    }
    return null;
  };

  useEffect(() => {
    getDemoUserToken();
  }, [userId, router]);

  return <p>Logging you in...</p>;
}
