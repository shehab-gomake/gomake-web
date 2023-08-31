export interface ISideListProps {
    list: IListItem [];
    selectedItem: string;
    onSelect: (value) => void;
    title: string;
    children?: any;
    quickActions?: boolean;
    isAdmin?: boolean;
}


export interface IListItem {
    text: string;
    value?: string;
    component?: ()=> JSX.Element;
    icon?: () => JSX.Element;
}