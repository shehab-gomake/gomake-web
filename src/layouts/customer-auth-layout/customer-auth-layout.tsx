import { IAuthLayout } from "./interfaces";
import { LeftSideLayout } from "./left-side";
import { useStyle } from "./style";
import { useAuthLayoutHook } from "./use-auth-layout-hook";
import { HeaderWidget } from "@/widgets/header";
import { LAYOUT_DEFAULT_GAP } from "@/utils/layout-config";
import { GoMakeModal } from "@/components";
import { useHtmlTour } from "@/layouts/customer-auth-layout/use-html-tour";
import { useFilesUploaderSignalr } from "@/hooks/signalr/use-files-uploader-signalr";
import { FilesUploaderWidget } from "@/widgets/file-uploader-widget/files-uploader-widget";
import { useMessengerSignalr } from "@/hooks/signalr/use-messenger-signalr";
import { useEffect } from "react";

const CustomerAuthLayout = ({
  children,
  permissionEnumValue,
  customGap = LAYOUT_DEFAULT_GAP,
  allowAnonymous,
  disableHeaderSideMenu,
  className,
}: IAuthLayout) => {
  const { canAccess } = useAuthLayoutHook(permissionEnumValue, allowAnonymous);
  const { classes } = useStyle({
    isHover: false,
    navStatus: null,
    customGap,
  });

  const { htmlTour, openModal, onCloseModal } = useHtmlTour();
  const fileUploaderStream = useFilesUploaderSignalr();
  const messengerStream = useMessengerSignalr();

  useEffect(() => {
    return () => {
      fileUploaderStream.closeConnection();
      messengerStream.closeConnection();
    };
  }, []);

  return disableHeaderSideMenu ? (
    <>
      {canAccess && (
        <div style={{ ...classes.bodyContainer, backgroundColor: "#FFF" }}>
          {children}
        </div>
      )}
    </>
  ) : (
    <div style={classes.container}>
      <LeftSideLayout customGap={customGap} />
      <div style={classes.rightContainer}>
        <HeaderWidget />
        {canAccess && (
          <div style={classes.bodyContainer} className={className}>
            {children}
          </div>
        )}
      </div>
      <FilesUploaderWidget />
      <GoMakeModal
        insideStyle={{ height: "fit-content" }}
        openModal={openModal}
        onClose={onCloseModal}
      >
        <div
          dangerouslySetInnerHTML={{ __html: htmlTour }}
          style={{ padding: "10px" }}
        />
      </GoMakeModal>
    </div>
  );
};

export { CustomerAuthLayout };
