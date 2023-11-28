export interface ITabsProps {
    tabs: ITab[];
    children?: JSX.Element;
    navigationButtons?: boolean;
    actionBtn?: HTMLButtonElement;
    onSelectTab?: (index: number) => void;
    selectedColor?: "primary" | "secondary";
}

export interface ITab {
    title: string;
    component?: JSX.Element;
}