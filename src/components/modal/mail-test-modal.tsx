import { GoMakeModal } from "./modal";
import { useRecoilState } from "recoil";
import { mailTestModalContentState, mailTestModalOpenState } from "@/store/mail-test-modal";
import { useTranslation } from "react-i18next";

const MailTestModal = () => {
    const [open, setOpen] = useRecoilState(mailTestModalOpenState);
    const [content] = useRecoilState(mailTestModalContentState);
    const { t } = useTranslation();
    return (
        <GoMakeModal
            openModal={open}
            onClose={() => setOpen(false)}
            modalTitle={t("mailingSettings.mailBody")}
            insideStyle={{ width: 600 }}
        >
            <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</div>
        </GoMakeModal>
    );
};

export { MailTestModal };


