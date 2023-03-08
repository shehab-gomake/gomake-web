import { userState } from "@/store/user";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useGomakeRouter = () => {
  const router = useRouter();
  const navigate = useCallback(
    (route: string, data?: any) => {
      router.push(route, data);
    },
    [router]
  );

  return { navigate };
};

export { useGomakeRouter };
