import { QuickSetipWidget } from "@/widgets/quick-setup-widgets/quick-setup/quick-setup";
import { QuickSetipMobileWidget } from "@/widgets/quick-setup-widgets/quick-setup/quick-setup-mobile";
import { useEffect, useState } from "react";

export default function QuickSetupCompanyPage() {
    const [isMobile, setIsMobile] = useState(null);
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIsMobile();

        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    return (
        <>
            {
                isMobile === null ? <></> :
                    isMobile === false ? <QuickSetipWidget /> :
                        <QuickSetipMobileWidget isMobile={isMobile} />
            }


        </>
    );
}