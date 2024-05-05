import { DetailedHTMLProps, HTMLAttributes} from "react";

declare global {

 namespace JSX {
    interface IntrinsicElements{
        'df-messenger': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
            // Add any specific attributes for your custom element here
            [prop: string]: any;
        };
        'df-messenger-chat': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
            [prop: string]: any;

        }
    }
}
}