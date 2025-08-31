import { useEffect } from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilState } from "recoil";
import { mailTestModalContentState, mailTestModalOpenState } from "@/store/mail-test-modal";

const useMailTestSocketIO = () => {
  const [, setOpen] = useRecoilState(mailTestModalOpenState);
  const [, setContent] = useRecoilState(mailTestModalContentState);

  useEffect(() => {
    const socket = io(config.api_server);
    socket.on("mailTestSocket", (data: { mailContent?: string } | string) => {
      const content = typeof data === "string" ? data : data?.mailContent || "";
      setContent(content);
      setOpen(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [setOpen, setContent]);

  return {};
};

export { useMailTestSocketIO };


