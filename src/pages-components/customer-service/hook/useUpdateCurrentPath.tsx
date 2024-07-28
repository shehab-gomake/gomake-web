import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { currentPathState } from "../store/currentPathState";

const useUpdateCurrentPath = () => {
  const router = useRouter();
  const setCurrentPath = useSetRecoilState(currentPathState);

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router.asPath, setCurrentPath]);
};

export default useUpdateCurrentPath;
