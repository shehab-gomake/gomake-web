import {useStyle} from "@/layouts/quick-setup-layout/style";

interface QuickSetupLayoutProps {
    pageTitle: string;
    headerColor: 'primary' | 'cyan' | 'magenta';
    children: JSX.Element;
}
const QuickSetupLayout = ({headerColor, pageTitle, children}: QuickSetupLayoutProps) => {
    const {classes} = useStyle(headerColor);
    return (
        <div style={classes.container}>
            <div style={classes.header}>
                <span style={classes.title}>{pageTitle}</span>
            </div>
            <div style={classes.body}>
                {children}
            </div>
        </div>
    )
}

export {QuickSetupLayout}