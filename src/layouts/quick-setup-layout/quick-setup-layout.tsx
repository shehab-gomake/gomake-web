import { useStyle } from "@/layouts/quick-setup-layout/style";
import { useTranslation } from "react-i18next";

interface QuickSetupLayoutProps {
    pageTitle: string;
    headerColor: 'primary' | 'cyan' | 'magenta';
    children: JSX.Element;
}
const QuickSetupLayout = ({ headerColor, pageTitle, children }: QuickSetupLayoutProps) => {
    const { classes } = useStyle(headerColor);
    const { t } = useTranslation();
    return (
        <div style={classes.container}>
            <div style={classes.header}>
                <span style={classes.title}>{t(pageTitle)}</span>
            </div>
            <div style={classes.body}>
                {children}
            </div>
        </div>
    )
}

export { QuickSetupLayout }