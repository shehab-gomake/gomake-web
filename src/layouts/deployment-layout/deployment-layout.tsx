import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-admin-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { useTrialRedirect } from "@/hooks/use-trial-redirect";

const DeploymentLayout = ({ children }: IAuthLayout) => {
  const { clasess } = useStyle({});

  // Handle trial redirect
  useTrialRedirect();

  return (
    <div style={clasess.container}>
      <LeftSideLayout />
      <div style={clasess.rightContainer}>
        <div style={clasess.headerContainer}>
          <HeaderWidget />
        </div>
        <div style={clasess.bodyContainer}>{children}</div>
      </div>
    </div>
  );
};

export { DeploymentLayout };
