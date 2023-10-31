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
        let clickedInside;
        if (exceptionRef) {
            clickedInside = (wrapperRef && wrapperRef.current.contains(event.target)) || exceptionRef.current === event.target || exceptionRef.current?.contains(event.target);
        } else {
            clickedInside = (wrapperRef && wrapperRef.current.contains(event.target));
        }

        if (clickedInside) {
            return;
        } else {
            event.preventDefault();
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