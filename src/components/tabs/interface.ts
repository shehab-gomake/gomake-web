export interface ITabsProps {
    tabs: ITab[];
    children?: JSX.Element;
    navigationButtons?: boolean;
    actionBtn?: HTMLButtonElement;
}

export interface ITab {
    title: string;
    component: JSX.Element;
}