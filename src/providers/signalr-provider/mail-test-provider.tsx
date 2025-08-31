import React, { createContext, useContext } from "react";
import { useMailTestSocketIO } from "@/hooks/socket-io/use-mail-test-socket-io";
import { MailTestModal } from "@/components/modal/mail-test-modal";

const MailTestContext = createContext<any>(null);

export const MailTestProvider = ({ children }: { children: React.ReactNode }) => {
    useMailTestSocketIO();

    return (
        <MailTestContext.Provider value={{}}>
            {children}
            <MailTestModal />
        </MailTestContext.Provider>
    );
};

export const useMailTest = () => {
    const context = useContext(MailTestContext);
    if (context === undefined) {
        throw new Error("useMailTest must be used within a MailTestProvider");
    }
    return context;
};


