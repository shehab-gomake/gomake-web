export type SELECT_COLOR = "primary" | "secondary";
export type TAB_TYPE = "UnderlinedTabs " | "ButtonedTabs";

export interface ITabsProps {
    tabs: ITab[];
    children?: JSX.Element;
    navigationButtons?: boolean;
    actionBtn?: HTMLButtonElement;
    onSelectTab?: (index: number) => void;
    selectedColor?: SELECT_COLOR;
    variant?: TAB_TYPE;
}

export interface ITab {
    title: string;
    component?: JSX.Element;
}