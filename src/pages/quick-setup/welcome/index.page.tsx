import { QuickSetupWelcomeWidget } from "@/widgets/quick-setup-widgets/quick-setup-welcome/quick-setup-welcome";
import { QuickSetupWelcomeMobileWidget } from "@/widgets/quick-setup-widgets/quick-setup-welcome/quick-setup-welcome-mobile";
import { useEffect, useState } from "react";

export default function WelcomeQuickSetupPage() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIsMobile();

        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    return (
        <>
            {
                isMobile ? <QuickSetupWelcomeMobileWidget isMobile={isMobile} /> : <QuickSetupWelcomeWidget />
            }

        </>
    );
}