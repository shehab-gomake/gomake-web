import { CustomerAuthLayout } from "@/layouts";
import { MessageLogs } from "@/widgets/settings-mailing/message-logs/message-logs";

export default function MailingLogsPage() {
    return (
        <CustomerAuthLayout staticPageTitle="mailing logs" className={`custom-scrollbar`}>
            <MessageLogs />
        </CustomerAuthLayout>
    );
} 