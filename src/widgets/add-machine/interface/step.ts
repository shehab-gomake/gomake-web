
export interface IStep {
    label: string;
    component: () => JSX.Element;
    icon: any;
}