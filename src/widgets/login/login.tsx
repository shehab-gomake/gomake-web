import { LoginLeftSide } from "./left-side/left-side";
import { LoginRightSide } from "./right-side/right-side";
import { useStyle } from "./style";
import {useGomakeLogin} from "@/widgets/login/use-login";
import {useEffect} from "react";

const LoginWidget = () => {
  const { clasess } = useStyle();
  const {getUserProfile} = useGomakeLogin();
  useEffect(()=> {
      getUserProfile().then();
  }, [])
  return (
    <div style={clasess.container}>
      <LoginLeftSide />
      <LoginRightSide />
    </div>
  );
};
export { LoginWidget };
