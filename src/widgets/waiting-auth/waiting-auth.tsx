import * as animationData from "./loading.json";

import { useStyle } from "./style";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};
const WaitingAuth = () => {
  const { clasess } = useStyle();

  return (
    <div style={clasess.container}>
      {/* <Lottie options={defaultOptions} height={"25%"} width={"25%"} /> */}
    </div>
  );
};
export { WaitingAuth };
