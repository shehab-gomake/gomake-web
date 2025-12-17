import {useRef, useEffect, CSSProperties} from 'react';

interface IProps {
    children?: any,
    exceptionRef?: any,
    onClick: () => void,
    style?: CSSProperties;
}

const ClickOutside = ({children, exceptionRef, onClick, style}: IProps) => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickListener);

        return () => {
            document.removeEventListener('mousedown', handleClickListener);
        };
    }, [children]);

    const handleClickListener = (event) => {
        // Check if click is on Material-UI Autocomplete popup or options
        const target = event.target as HTMLElement;
        const isMuiAutocompletePopup = target.closest('.MuiAutocomplete-popper') || 
                                       target.closest('.MuiAutocomplete-listbox') ||
                                       target.closest('.MuiAutocomplete-option') ||
                                       target.closest('[role="option"]') ||
                                       target.closest('[data-popper-placement]');
        
        if (isMuiAutocompletePopup) {
            return; // Don't fire onClick when clicking on dropdown options
        }

        let clickedInside;
        if (exceptionRef) {
            clickedInside = (wrapperRef && wrapperRef.current.contains(event.target)) || exceptionRef.current === event.target || exceptionRef.current?.contains(event.target);
        } else {
            clickedInside = (wrapperRef && wrapperRef.current.contains(event.target));
        }

        if (clickedInside) {
            return;
        } else {
            // Don't prevent default to allow dropdown onChange to fire
            onClick();
        }
    }

    return (
        <div ref={wrapperRef} style={style}>
            {children}
        </div>
    );
};

export {ClickOutside}